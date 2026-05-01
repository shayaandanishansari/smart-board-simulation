const queries = require('../db/queries');

function validatePin(req, res, next) {
    const boardId = req.params.board_id || req.query.board_id || req.body.board_id;
    const pin = req.headers['x-pin'] || req.query.pin || req.body.pin;

    if (!boardId || !pin) {
        return res.status(401).json({ error: 'board_id and pin are required' });
    }

    const board = queries.getBoard(boardId);

    if (!board) {
        return res.status(404).json({ error: 'Board not found' });
    }

    if (board.pin !== pin) {
        return res.status(403).json({ error: 'Invalid PIN' });
    }

    req.board = board;
    next();
}

module.exports = {
    validatePin
};
