const WebSocket = require('ws');
const queries = require('../db/queries');
const pzemService = require('../services/pzem');

function handlePzemWebSocket(wss, server) {
    server.on('upgrade', (request, socket, head) => {
        const url = new URL(request.url, `http://${request.headers.host}`);
        const pathname = url.pathname;
        const match = pathname.match(/\/pzem\/(.+)/);

        if (match) {
            const boardId = match[1];
            wss.handleUpgrade(request, socket, head, (ws) => {
                const pin = url.searchParams.get('pin');

                if (pin) {
                    // Flutter connection
                    const board = queries.getBoard(boardId);
                    if (board && board.pin === pin) {
                        pzemService.registerFlutterClient(boardId, ws);
                        console.log(`Flutter client connected to PZEM for board: ${boardId}`);
                    } else {
                        ws.close(1008, 'Invalid PIN');
                    }
                } else {
                    // React connection
                    ws.on('message', (message) => {
                        try {
                            const data = JSON.parse(message);
                            pzemService.handleReactMessage(boardId, data);
                        } catch (e) {
                            console.error('Error parsing PZEM message from React:', e);
                        }
                    });
                    console.log(`React client connected to PZEM for board: ${boardId}`);
                }
            });
        }
    });
}

module.exports = handlePzemWebSocket;
