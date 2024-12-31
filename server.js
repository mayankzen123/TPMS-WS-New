const express = require('express');
const { WebSocketServer } = require('ws');
const path = require('path');
const os = require('os');

// Create Express app for serving the HTML client
const app = express();
const port = process.env.PORT || 4000;

// Get server IP address
function getServerIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal and non-IPv4 addresses
            if (!iface.internal && iface.family === 'IPv4') {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const serverIP = getServerIP();

// Serve static files
app.use(express.static('public'));

// Create HTTP server
const server = app.listen(port, () => {
    console.log(`Server running at:`);
    console.log(`- Local: http://localhost:${port}`);
    console.log(`- Network: http://${serverIP}:${port}`);
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Echo back messages
    ws.on('message', (data) => {
        console.log('Received:', data.toString());
        ws.send(data.toString());
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});