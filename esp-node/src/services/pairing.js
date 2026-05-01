const dgram = require('dgram');
const { generatePin } = require('../utils/pin');
const queries = require('../db/queries');

const DISCOVERY_PORT = 4210; 
const BROADCAST_PORT = 4211; // Separate port for broadcasting to Flutter

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
        const message = `PAIR_REQUEST:${boardId}`;
        
        client.bind(() => {
            client.setBroadcast(true);
            // Flutter will listen on BROADCAST_PORT
            client.send(message, BROADCAST_PORT, '255.255.255.255', (err) => {
                if (err) console.error('UDP Broadcast error:', err);
                client.close();
            });
        });
    },

    initDiscoveryListener: () => {
        const server = dgram.createSocket('udp4');

        server.on('message', (msg, rinfo) => {
            const message = msg.toString();
            if (message === 'DISCOVER_SMARTBOARD_NODE') {
                const response = `SMARTBOARD_NODE_IP:127.0.0.1`; 
                server.send(response, rinfo.port, rinfo.address);
            }
        });

        server.bind(DISCOVERY_PORT, () => {
            console.log(`UDP Discovery listener active on port ${DISCOVERY_PORT}`);
        });
    }
};

module.exports = pairingService;
