export const generateBoardId = () => {
  return 'board_' + Math.random().toString(36).substr(2, 9);
};
