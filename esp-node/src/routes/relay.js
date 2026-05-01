const express = require('express');
const router = express.Router();
const relayService = require('../services/relay');
const { validatePin } = require('../utils/validator');

// React polls this on boot, Flutter also calls this.
// Flutter must provide PIN. React might not.
router.get('/:board_id', (req, res, next) => {
    // If PIN is provided, validate it.
    const pin = req.headers['x-pin'] || req.query.pin || (req.body && req.body.pin);
    if (pin) {
        return validatePin(req, res, next);
    }
    next();
}, (req, res) => {
    const { board_id } = req.params;
    const relayState = relayService.getRelayState(board_id);
    res.json({ board_id, relay_state: relayState });
});

// Flutter toggles relay
router.post('/:board_id', validatePin, (req, res) => {
    const { board_id } = req.params;
    const { relay_state } = req.body;
    
    // relay_state can be boolean or 0/1
    const newState = !!relay_state;
    const result = relayService.toggleRelay(board_id, newState);
    res.json(result);
});

module.exports = router;
