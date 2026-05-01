const queries = require('../db/queries');

const boardService = {
    createBoard: (boardId) => {
        queries.createBoard(boardId);
        return queries.getBoard(boardId);
    }
};

module.exports = boardService;
