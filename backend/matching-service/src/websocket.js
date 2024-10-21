import WebSocket from 'ws';

const ws_clients = new Map();

const initializeWebSocketServer = (port) => {
  const wss = new WebSocket.Server({ port });

  wss.on('connection', (ws, req) => {
    const userId = req.url.split('/').pop();
    ws_clients.set(userId, ws);

    ws.on('close', () => {
      ws_clients.delete(userId);
    });
  });

  console.log(`WebSocket server is running on port ${port}`);
};

const notifyUser = (userId, status) => {
  const ws = ws_clients.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    const message = `{"userId":"${userId}","status":"${status}"}`;
    console.log(message);
    ws.send(message);
  }
};

export { initializeWebSocketServer, notifyUser, ws_clients };
