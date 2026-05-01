import { useEffect, useRef } from 'react';
import useBoardStore from '../store/boardStore';
import { generatePzemReading } from '../simulation/pzemGenerator';
import { connectPzemSocket } from '../services/socket';

const usePzem = (boardId) => {
  const { getBoard, updateBoard } = useBoardStore();
  const socketRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const board = getBoard(boardId);
    if (!board) return;

    // Connect to Node WebSocket for PZEM streaming
    socketRef.current = connectPzemSocket(boardId);
    socketRef.current.connect();

    // Generation loop (every 1 second)
    intervalRef.current = setInterval(() => {
      const currentBoard = useBoardStore.getState().getBoard(boardId);
      if (!currentBoard) return;

      const reading = generatePzemReading(currentBoard);
      
      // Update local energy accumulator
      if (reading.energyIncrement) {
        updateBoard(boardId, { 
          energy_accumulator: reading.energy 
        });
      }

      // Stream to Node if connected
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('pzem_data', {
          board_id: boardId,
          ...reading
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [boardId]);

  return null;
};

export default usePzem;
