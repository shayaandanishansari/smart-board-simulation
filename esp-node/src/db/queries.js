const { db } = require('./schema');

const queries = {
    getBoard: (boardId) => {
        return db.prepare('SELECT * FROM boards WHERE board_id = ?').get(boardId);
    },

    createBoard: (boardId) => {
        return db.prepare('INSERT OR IGNORE INTO boards (board_id) VALUES (?)').run(boardId);
    },

    updateRelay: (boardId, state) => {
        return db.prepare('UPDATE boards SET relay_state = ? WHERE board_id = ?').run(state ? 1 : 0, boardId);
    },

    updatePin: (boardId, pin) => {
        return db.prepare('UPDATE boards SET pin = ? WHERE board_id = ?').run(pin, boardId);
    },

    updatePzem: (boardId, { voltage, current, power, energy }) => {
        return db.prepare(`
            UPDATE boards 
            SET voltage = ?, current = ?, power = ?, energy = ? 
            WHERE board_id = ?
        `).run(voltage, current, power, energy, boardId);
    },

    getAllBoards: () => {
        return db.prepare('SELECT * FROM boards').all();
    },

    deleteBoard: (boardId) => {
        return db.prepare('DELETE FROM boards WHERE board_id = ?').run(boardId);
    }
};

module.exports = queries;
