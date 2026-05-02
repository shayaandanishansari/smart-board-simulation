const express = require('express');
const router = express.Router();
const boardService = require('../services/board');

router.post('/', (req, res) => {
    const { board_id } = req.body;
    if (!board_id) {
        return res.status(400).json({ error: 'board_id is required' });
    }
    const board = boardService.createBoard(board_id);
    res.json(board);
});

router.delete('/:board_id', (req, res) => {
    const { board_id } = req.params;
    boardService.deleteBoard(board_id);
    res.json({ success: true });
});

module.exports = router;
