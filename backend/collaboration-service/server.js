const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const WebSocket = require("ws");
const { setupWSConnection } = require("y-websocket/bin/utils");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const connectionURL = process.env.ATLAS_URI || "";
const frontendURL = process.env.frontendURL || "http://localhost:3000";

const roomParticipants = {};

// Connect to MongoDB
mongoose
  .connect(connectionURL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

// WebSocket server for Yjs
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket upgrade requests
server.on("upgrade", (request, socket, head) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`)
    .pathname;

  if (pathname.startsWith("/yjs")) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      const roomId = pathname.split("/")[2]; // Extract room ID from the path
      setupWSConnection(ws, request, { room: roomId });
    });
  } else {
    socket.destroy();
  }
});

const io = socketIo(server, {
  cors: {
    origin: frontendURL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Save initial attempt history
const saveAttemptHistory = async (attemptData) => {
  try {
    await axios.post("http://history-service:5001/history/add", attemptData);
    return { success: true, message: "Attempt history saved successfully" };
  } catch (error) {
    console.error("Error saving attempt history:", error);
    return { success: false, message: "Error saving attempt history" };
  }
};

// Update attempt history
const updateAttemptHistory = async (attemptId, updateData) => {
  try {
    await axios.put(
      `http://history-service:5001/history/update/${attemptId}`,
      updateData
    );
    return { success: true, message: "Attempt history updated successfully" };
  } catch (error) {
    console.error("Error updating attempt history:", error);
    return { success: false, message: "Error updating attempt history" };
  }
};

// Room Model
const Room = require("./models/Room");

// Create a new room with participants
app.post("/create-room", async (req, res) => {
  const { roomId, participants, question } = req.body;

  try {
    const attemptData = {
      attempt_id: roomId,
      user_ids: participants,
      question_id: question._id,
      first_attempt_date: new Date(),
      code_contents: "",
      whiteboard_state: {},
    };
    console.log("attemptData", attemptData);
    await saveAttemptHistory(attemptData);

    let existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res
        .status(400)
        .json({ message: "Room already exists", status: 400 });
    }

    const newRoom = new Room({ roomId, participants, question });
    await newRoom.save();
    return res
      .status(201)
      .json({ message: "Room created", room: newRoom, status: 201 });
  } catch (err) {
    return res.status(500).json({
      message: "Error creating room",
      error: err.message,
      status: 500,
    });
  }
});

// Get room details by roomId (Check if room exists)
app.get("/room-exists/:roomId", async (req, res) => {
  const { roomId } = req.params;

  try {
    let room = await Room.findOne({ roomId });
    if (room) {
      return res.status(200).json({ exists: true, room });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error checking room", error: err.message });
  }
});

// Check if user has an active session
app.get("/active-user/:userId", async (req, res) => {
  const { userId } = req.params;

  // Iterate over all rooms in roomParticipants
  for (const [_, participants] of Object.entries(roomParticipants)) {
    if (participants.includes(userId)) {
      return res.status(200).json(true); // Respond with true if active
    }
  }
  return res.status(200).json(false); // Respond with false if not active
});

// Get active session based on username
app.get("/session/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Iterate over all rooms in roomParticipants
    for (const [roomId, participants] of Object.entries(roomParticipants)) {
      if (participants.includes(username)) {
        // Fetch room details, such as the question, from the database or session storage
        const sessionData = await Room.findOne({ roomId });

        if (sessionData) {
          return res.status(200).json(sessionData);
        }
      }
    }

    // No active session found for the specified username
    return res.status(404).json({
      message: "No active session found for the specified user.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving room information",
      error: error.message,
    });
  }
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Join room event
  socket.on("joinRoom", async (roomId, username) => {
    try {
      const room = await Room.findOne({ roomId });
      if (!room) {
        console.log("Room does not exist");
        socket.emit("error", { message: "Room not found" });
        return;
      }

      // Check if the room is full
      if (
        room.participants.length >= 2 &&
        !room.participants.includes(username)
      ) {
        socket.emit("error", { message: "Room full" });
        return;
      }

      // Add user to the room
      if (!room.participants.includes(username)) {
        room.participants.push(username);
        await room.save();
      }

      // Join the Socket.IO room
      socket.join(roomId);
      io.to(roomId).emit("roomUsers", roomParticipants[roomId]);
      console.log(`${username} joined room: ${roomId}`);

      if (!roomParticipants[roomId]) {
        const people = [];
        people.push(username);
        roomParticipants[roomId] = people;
      } else {
        if (!roomParticipants[roomId].includes(username)) {
          roomParticipants[roomId].push(username);
        }
      }
      console.log("roomParticipants", roomParticipants);
      console.log(
        `Room ${roomId} has ${roomParticipants[roomId]} participants`
      );

      if (roomParticipants[roomId].length === 2) {
        // Send a message to the frontend
        io.to(roomId).emit("roomFull", {
          message: "Room is now full and ready!",
          roomId: roomId,
          participants: roomParticipants[roomId],
        });
        console.log(`Room ${roomId} is now full`);
      }

      // Notify other users in the room that a user joined
      socket.to(roomId).emit("userJoined", { username });
    } catch (err) {
      socket.emit("error", {
        message: "Error joining room",
        error: err.message,
      });
    }
  });

  // Handle real-time drawing
  socket.on("drawing", (data) => {
    const { roomId, ...drawingData } = data;
    socket.to(roomId).emit("drawing", drawingData); // Broadcast drawing data to the room
  });

  // Handle real-time chat messages
  socket.on("sendMessage", (messageData) => {
    const { roomId, username, text, timestamp } = messageData;

    // Broadcast the message to everyone else in the room
    io.to(roomId).emit("receiveMessage", {
      username,
      text,
      timestamp,
    });

    console.log(`Message from ${username} in room ${roomId}: ${text}`);
  });

  //Handle whiteboard being opened
  socket.on("toggleWhiteboardOn", (roomId) => {
    // Broadcast to everyone in the room
    console.log(`Opening whiteboard for room: ${roomId}`);
    io.to(roomId).emit("openWhiteboard");
  });

  socket.on("toggleWhiteboardOff", (roomId) => {
    // Broadcast to everyone in the room
    console.log(`Closing whiteboard for room: ${roomId}`);
    io.to(roomId).emit("closeWhiteboard");
  });

  socket.on("userLeft", ({ username, roomId }) => {
    if (roomParticipants[roomId]) {
      // Remove the user from roomParticipants
      roomParticipants[roomId] = roomParticipants[roomId].filter(
        (participant) => participant !== username
      );

      // Notify other users in the room
      io.to(roomId).emit("userLeft", { username });

      console.log(`${username} left room: ${roomId}`);
      console.log("Updated roomParticipants", roomParticipants);

      // If the room becomes empty, clean up
      if (roomParticipants[roomId].length === 0) {
        delete roomParticipants[roomId];
      }
      console.log("user left", username, roomId);
    }
  });

  // Handle disconnect
  socket.on("disconnect", (roomId) => {
    console.log("partner left");
    io.to(roomId).emit("partnerDisconnect");
  });

  // Handle "endSession" event
  socket.on("endSession", async (roomId, codeContents, whiteboardState) => {
    if (roomParticipants[roomId]) {
      // Get all connected sockets in the room and disconnect them
      // const roomSockets = io.sockets.adapter.rooms.get(roomId);
      // if (roomSockets) {
      //   roomSockets.forEach((socketId) => {
      //     const socketToDisconnect = io.sockets.sockets.get(socketId);
      //     socketToDisconnect.disconnect(true); // Forcefully disconnect socket
      //   });
      // }
      // inform users its time to go
      // socket.to(roomId).emit("sessionEnded", { username });

      // Update attempt history with code contents and whiteboard state
      const updateData = {
        code_contents: codeContents,
        whiteboard_state: whiteboardState,
      };

      try {
        await updateAttemptHistory(roomId, updateData);
        console.log(`Attempt history for room ${roomId} updated successfully.`);
      } catch (error) {
        console.error(
          `Error updating attempt history for room ${roomId}:`,
          error
        );
      }

      // Clear room participants list
      delete roomParticipants[roomId];
      io.to(roomId).emit("endSession");
      console.log(
        `Session in room ${roomId} has been ended and all users disconnected.`
      );
    }
  });
});
