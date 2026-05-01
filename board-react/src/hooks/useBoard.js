import useBoardStore from '../store/boardStore';
import { generateBoardId } from '../utils/boardId';

const useBoard = () => {
  const addBoard = useBoardStore((state) => state.addBoard);
  const boards = useBoardStore((state) => state.boards);

  const createNewBoard = (config) => {
    const boardId = generateBoardId();
    addBoard({
      ...config,
      board_id: boardId,
    });
    return boardId;
  };

  return {
    boards,
    createNewBoard,
  };
};

export default useBoard;
