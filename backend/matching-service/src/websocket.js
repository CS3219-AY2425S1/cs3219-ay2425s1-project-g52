import WebSocket from "ws";

const ws_clients = new Map();

// Initialize the WebSocket server
export async function initializeWebSocketServer(port) {
  const wss = new WebSocket.Server({ port });

  wss.on("connection", (ws, req) => {
    const userId = req.url.split("/").pop();
    ws_clients.set(userId, ws);

    ws.on("close", () => {
      ws_clients.delete(userId);
    });
  });

  console.log(`WebSocket server is running on port ${port}`);
}

// To notify the user about the status of the request
export function notifyUser(userId, status, roomData = undefined) {
  const ws = ws_clients.get(userId);
  if (ws?.readyState === WebSocket.OPEN) {
    const messageObject = {
      userId: userId,
      status: status,
    };

    if (roomData !== undefined) {
      messageObject.roomId = roomData.roomId;
      messageObject.question = roomData.question;
    }
    const message = JSON.stringify(messageObject);

    console.log("message sent to user:", message);
    ws.send(message);
  }
}

export { ws_clients };
