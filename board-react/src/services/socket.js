import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const connectPzemSocket = (boardId) => {
  const pzemSocket = io(`${SOCKET_URL}/pzem`, {
    query: { boardId },
  });
  return pzemSocket;
};

export default socket;
