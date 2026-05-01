const express = require('express');
const router = express.Router();
const pairingService = require('../services/pairing');

router.post('/:board_id', (req, res) => {
    const { board_id } = req.params;
    try {
        const pin = pairingService.generateAndSetPin(board_id);
        res.json({ board_id, pin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
