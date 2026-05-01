const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const morgan = require('morgan');
const { initDb } = require('./src/db/schema');
const pairingService = require('./src/services/pairing');
const pzemService = require('./src/services/pzem');
const queries = require('./src/db/queries');

const boardRoutes = require('./src/routes/board');
const relayRoutes = require('./src/routes/relay');
const pairingRoutes = require('./src/routes/pairing');

const pzemRoute = require('./src/routes/pzem');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

const PORT = process.env.PORT || 3000;

// Initialize Database
initDb();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/board', boardRoutes);
app.use('/relay', relayRoutes);
app.use('/pair', pairingRoutes);

// Health check
app.get('/health', (req, res) => res.send('OK'));

// WebSocket Handling
pzemRoute(wss, server);

// Start UDP Discovery Listener
pairingService.initDiscoveryListener();

// Start Server
server.listen(PORT, () => {
    console.log(`ESP-Node server running on port ${PORT}`);
});
