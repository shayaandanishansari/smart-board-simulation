const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3000';

export const connectPzemSocket = (boardId) => {
  const ws = new WebSocket(`${SOCKET_URL}/pzem/${boardId}`);
  
  ws.onopen = () => {
    console.log(`React PZEM WebSocket connected for board: ${boardId}`);
  };

  ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };

  return ws;
};

export default connectPzemSocket;
