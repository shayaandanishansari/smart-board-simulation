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

module.exports = router;
