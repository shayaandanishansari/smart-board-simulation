const dgram = require('dgram');
const { generatePin } = require('../utils/pin');
const queries = require('../db/queries');

const UDP_PORT = 41234; // Example port for UDP

const pairingService = {
    generateAndSetPin: (boardId) => {
        const pin = generatePin();
        queries.updatePin(boardId, pin);
        
        // UDP broadcast to listening Flutter
        pairingService.broadcastPairRequest(boardId);
        
        return pin;
    },

    broadcastPairRequest: (boardId) => {
        const client = dgram.createSocket('udp4');
        const message = JSON.stringify({ event: 'pair_request', board_id: boardId });
        
        client.bind(() => {
            client.setBroadcast(true);
            // In a real scenario, we'd broadcast to the subnet. 
            // For simulation, we can broadcast to 255.255.255.255
            client.send(message, UDP_PORT, '255.255.255.255', (err) => {
                if (err) console.error('UDP Broadcast error:', err);
                client.close();
            });
        });
    },

    initDiscoveryListener: () => {
        const server = dgram.createSocket('udp4');

        server.on('message', (msg, rinfo) => {
            try {
                const data = JSON.parse(msg.toString());
                if (data.event === 'discover_node') {
                    const response = JSON.stringify({ event: 'node_info', ip: '127.0.0.1', port: 3000 }); // Replace with actual IP/Port
                    server.send(response, rinfo.port, rinfo.address);
                }
            } catch (e) {
                // Ignore non-JSON or malformed messages
            }
        });

        server.bind(UDP_PORT, () => {
            console.log(`UDP Discovery listener active on port ${UDP_PORT}`);
        });
    }
};

module.exports = pairingService;
