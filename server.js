/**
 * Velvet & Vow | Zero-dependency Local Server & Realtime Sync Engine
 * Run with: node server.js
 * Automatically discovers your local Wi-Fi IP so both phones can connect instantly!
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// In-memory room state for real-time synchronization
const rooms = {};
const sseClients = {}; // roomId -> [res]

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // CORS headers for easy local testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // SSE Stream for Real-time Two-Phone Sync
  if (pathname === '/api/events') {
    const roomId = parsedUrl.searchParams.get('room') || 'default';
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    if (!sseClients[roomId]) sseClients[roomId] = [];
    sseClients[roomId].push(res);

    // Send initial room state
    if (rooms[roomId]) {
      res.write(`data: ${JSON.stringify({ type: 'sync_state', state: rooms[roomId] })}\n\n`);
    }

    req.on('close', () => {
      sseClients[roomId] = (sseClients[roomId] || []).filter(c => c !== res);
    });
    return;
  }

  // POST Message Broadcast endpoint
  if (pathname === '/api/sync' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const roomId = data.room || 'default';
        if (!rooms[roomId]) rooms[roomId] = {};
        
        // Merge state
        if (data.action === 'update_state') {
          rooms[roomId] = { ...rooms[roomId], ...data.payload };
        }

        // Broadcast to all devices in the room
        const clients = sseClients[roomId] || [];
        const eventData = `data: ${JSON.stringify(data)}\n\n`;
        clients.forEach(client => {
          try { client.write(eventData); } catch (e) {}
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const localIp = getLocalIp();

server.listen(PORT, '0.0.0.0', () => {
  console.log('----------------------------------------------------');
  console.log('✨ Velvet & Vow Couple App Server is Live!');
  console.log(`📱 Local PC Access:    http://localhost:${PORT}`);
  console.log(`📲 Mobile Phone Access: http://${localIp}:${PORT}`);
  console.log('----------------------------------------------------');
  console.log('To install on your phones:');
  console.log(`1. Connect both phones to your home Wi-Fi.`);
  console.log(`2. Open http://${localIp}:${PORT} in Safari (iOS) or Chrome (Android).`);
  console.log(`3. Tap "Add to Home Screen" to install it like a real native app!`);
  console.log('----------------------------------------------------');
});
