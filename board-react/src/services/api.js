import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

export const boardApi = {
  createBoard: (boardData) => api.post('/board', boardData),
  getRelayState: (boardId) => api.get(`/relay/${boardId}`),
  pairBoard: (boardId) => api.post(`/pair/${boardId}`),
};

export default api;
