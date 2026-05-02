const queries = require('../db/queries');

const boardService = {
    createBoard: (boardId) => {
        queries.createBoard(boardId);
        return queries.getBoard(boardId);
    },

    deleteBoard: (boardId) => {
        return queries.deleteBoard(boardId);
    }
};

module.exports = boardService;
