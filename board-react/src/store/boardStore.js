import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useBoardStore = create(
  persist(
    (set, get) => ({
      boards: [],
      
      addBoard: (board) => set((state) => ({ 
        boards: [...state.boards, {
          ...board,
          mains: true,
          mcb: true,
          rocker: false,
          relay_state: false,
          energy_accumulator: 0, // kWh
        }] 
      })),

      updateBoard: (boardId, updates) => set((state) => ({
        boards: state.boards.map((b) => 
          b.board_id === boardId ? { ...b, ...updates } : b
        )
      })),

      removeBoard: (boardId) => set((state) => ({
        boards: state.boards.filter((b) => b.board_id !== boardId)
      })),

      getBoard: (boardId) => get().boards.find((b) => b.board_id === boardId),
    }),
    {
      name: 'smart-board-storage',
      storage: createJSONStorage(() => localStorage), // context.md mentioned IndexedDB, but localStorage is simpler for MVP unless specified otherwise. Persist plugin works with both.
    }
  )
);

export default useBoardStore;
