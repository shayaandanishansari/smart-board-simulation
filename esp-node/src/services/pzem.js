const queries = require('../db/queries');

// Store active flutter connections per board_id
// Map<board_id, Set<WebSocket>>
const flutterClients = new Map();

const pzemService = {
    handleReactMessage: (boardId, data) => {
        // Update SQLite with latest readings
        queries.updatePzem(boardId, data);

        // Forward to all connected flutter clients for this board
        const clients = flutterClients.get(boardId);
        if (clients) {
            const message = JSON.stringify({ board_id: boardId, ...data });
            clients.forEach(client => {
                if (client.readyState === 1) { // OPEN
                    client.send(message);
                }
            });
        }
    },

    registerFlutterClient: (boardId, ws) => {
        if (!flutterClients.has(boardId)) {
            flutterClients.set(boardId, new Set());
        }
        flutterClients.get(boardId).add(ws);

        ws.on('close', () => {
            const clients = flutterClients.get(boardId);
            if (clients) {
                clients.delete(ws);
                if (clients.size === 0) {
                    flutterClients.delete(boardId);
                }
            }
        });
    }
};

module.exports = pzemService;
