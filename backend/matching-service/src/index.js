import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectMongoDB, connectRabbitMQ, getChannel } from "./connections.js";
import {
  addUser,
  getMatchQueue,
  removeUser,
  initializeMatchQueue,
} from "./matchQueue.js";
import { initializeWebSocketServer, notifyUser } from "./websocket.js";

dotenv.config();

const app = express();
let channel;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const PORT = process.env.MATCHING_SERVICE_PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const initialize = async () => {
  try {
    await connectMongoDB();
    await connectRabbitMQ();
    channel = getChannel();
    await initializeMatchQueue();
    await processMatchRequests();
    console.log("All services initialized successfully");
  } catch (error) {
    console.error("Error during initialization:", error);
  }
};

initialize();

initializeWebSocketServer(process.env.WEBSOCKET_PORT || 8080);

const meetHardMatchingCriteria = (user1, user2) => {
  return (
    user1.topic === user2.topic &&
    user1.difficulty === user2.difficulty &&
    user1.userId !== user2.userId
  );
};

const meetSoftMatchingCriteria = (user1, user2) => {
  return user1.topic === user2.topic && user1.userId !== user2.userId;
};

const processMatchRequests = async () => {
  await channel.consume("match_requests", async (request) => {
    if (request !== null) {
      const matchRequest = JSON.parse(request.content.toString());
      
      const matchQueue = await getMatchQueue();
      let matched = false;
      console.log("Queue status before match is formed:", matchQueue);
      for (let i = 0; i < matchQueue.length; i++) {
        if (meetHardMatchingCriteria(matchQueue[i], matchRequest)) {
          const user1 = matchQueue[i];
          const user2 = matchRequest;
          await removeUser(user1.userId);
          await removeUser(user2.userId);
          notifyUser(user1.userId, "matched");
          notifyUser(user2.userId, "matched");
          matched = true;
          break;
        }
      }

      if (!matched) {
        for (let i = 0; i < matchQueue.length; i++) {
          if (meetSoftMatchingCriteria(matchQueue[i], matchRequest)) {
            const user1 = matchQueue[i];
            const user2 = matchRequest;
            await removeUser(user1.userId);
            await removeUser(user2.userId);
            notifyUser(user1.userId, "matched");
            notifyUser(user2.userId, "matched");
            matched = true;
            break;
          }
        }
        if (matched) {
          console.log("Queue status after match is formed:", await getMatchQueue());
        }

        
        channel.ack(request);
      }
    }
  });

  await channel.consume("notifications", async (msg) => {
    if (msg !== null) {
      const notification = JSON.parse(msg.content.toString());
      notifyUser(notification.userId, notification.status);
      channel.ack(msg);
    }
  });
};

app.post("/match", async (req, res) => {
  console.log("Received /match request:", req.body);
  const user = req.body;
  try {
    const result = await addUser(user);
    if (result.error) {
      console.error("Error adding user:", result.error);
      res.status(400).send(result.error);
    } else {
      channel.sendToQueue("match_requests", Buffer.from(JSON.stringify(user)));
      console.log(
        "User added successfully and match request sent:",
        result.success
      );
      res.status(200).send(result.success);
    }
  } catch (error) {
    console.error("Exception occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/queue", async (req, res) => {
  console.log("Received /queue request");
  try {
    const queueStatus = await getMatchQueue();
    res.status(200).send(queueStatus);
  } catch (error) {
    console.error("Exception occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/match/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    await removeUser(userId);
    res.status(200).send(`User ${userId} removed from matching queue`);
  } catch (error) {
    console.error("Error removing user:", error);
    res.status(500).send("Internal Server Error");
  }
});
