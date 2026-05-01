const queries = require('../db/queries');

const relayService = {
    getRelayState: (boardId) => {
        const board = queries.getBoard(boardId);
        return board ? board.relay_state : 0;
    },

    toggleRelay: (boardId, state) => {
        queries.updateRelay(boardId, state);
        return { board_id: boardId, relay_state: state ? 1 : 0 };
    }
};

module.exports = relayService;
