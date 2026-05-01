import { useEffect } from 'react';
import useBoardStore from '../store/boardStore';
import { boardApi } from '../services/api';

const useRelay = (boardId) => {
  const { updateBoard } = useBoardStore();

  useEffect(() => {
    const fetchRelayState = async () => {
      try {
        const response = await boardApi.getRelayState(boardId);
        updateBoard(boardId, { relay_state: response.data.relay_state });
      } catch (error) {
        console.error(`Failed to fetch relay state for board ${boardId}:`, error);
      }
    };

    fetchRelayState();
    
    // Optional: Poll every 5 seconds if not using WebSockets for relay updates
    const interval = setInterval(fetchRelayState, 5000);

    return () => clearInterval(interval);
  }, [boardId, updateBoard]);
};

export default useRelay;
