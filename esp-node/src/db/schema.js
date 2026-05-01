const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../state.db');
const db = new Database(dbPath);

function initDb() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS boards (
            board_id TEXT PRIMARY KEY,
            relay_state INTEGER DEFAULT 0,
            pin TEXT,
            voltage REAL DEFAULT 0,
            current REAL DEFAULT 0,
            power REAL DEFAULT 0,
            energy REAL DEFAULT 0
        )
    `);
    console.log('Database initialized');
}

module.exports = {
    db,
    initDb
};
