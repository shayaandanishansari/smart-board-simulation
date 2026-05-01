import { useEffect, useRef, useState } from 'react';
import useBoardStore from '../store/boardStore';
import { generatePzemReading } from '../simulation/pzemGenerator';
import { connectPzemSocket } from '../services/socket';

const usePzem = (boardId) => {
  const { getBoard, updateBoard } = useBoardStore();
  const [reading, setReading] = useState({ voltage: 0, current: 0, power: 0, frequency: 0, pf: 0, energy: 0 });
  const socketRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const board = getBoard(boardId);
    if (!board) return;

    // Connect to Node WebSocket for PZEM streaming
    socketRef.current = connectPzemSocket(boardId);

    // Generation loop (every 2 seconds to match new design)
    intervalRef.current = setInterval(() => {
      const currentBoard = useBoardStore.getState().getBoard(boardId);
      if (!currentBoard) return;

      const newReading = generatePzemReading(currentBoard);
      setReading(newReading);
      
      // Update local energy accumulator
      if (newReading.energyIncrement) {
        updateBoard(boardId, { 
          energy_accumulator: newReading.energy 
        });
      }

      // Stream to Node if connected
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          board_id: boardId,
          ...newReading
        }));
      }
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, [boardId]);

  return reading;
};

export default usePzem;
