import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectRabbitMQ, getChannel } from "./connections.js";
import { initializeMatchQueue, addUser, checkForMatches, requeueUser, removeUserFromAllQueues } from "./matchQueue.js";
import { initializeWebSocketServer } from "./websocket.js";
import { TOPICS, DIFFICULTIES } from './constants/constants.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.MATCHING_SERVICE_PORT || 3002;
initializeWebSocketServer(process.env.WEBSOCKET_PORT || 8080);

const initialize = async () => {
  try {
    await connectRabbitMQ();
    const channel = getChannel();
    await initializeMatchQueue(channel);
    console.log("All services initialized successfully");
    await processMatchRequests(channel);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
};

const processMatchRequests = async (channel) => {

  channel.prefetch(1);

  for (const topic of TOPICS) {
    const queueName = `${topic}_queue`;
    await channel.consume(queueName, async (request) => {
      if (request) {
        const matchRequest = JSON.parse(request.content.toString());
        console.log(`Received match request: ${JSON.stringify(matchRequest)}`);
        
        const matched = await checkForMatches(matchRequest, topic, channel, DIFFICULTIES);
        if (matched) {
          channel.ack(request);
        } else {
          console.log(`No match found for ${matchRequest.userId} in ${queueName}`);
          await requeueUser(matchRequest, channel);
          channel.ack(request);
        }
      }
    }, { noAck: false });
  }
};

initialize();

app.post("/match", async (req, res) => {
  console.log("Received user data:", req.body);
  const user = req.body;
  try {
    await addUser(user);
    res.status(200).send("User added to match queue");
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(400).send(error.message);
  }
});

app.delete("/match/:userId", async (req, res) => {
  const { userId } = req.params;
  const { topic, difficulty } = req.body;

  console.log(`Received DELETE request for userId: ${userId}, topic: ${topic}, difficulty: ${difficulty}`);

  try {
    const channel = await getChannel();
    await removeUserFromAllQueues(userId, topic, difficulty, channel);
    res.status(200).send(`User ${userId} removed from all queues`);
  } catch (error) {
    console.error("Error removing user from queues:", error);
    res.status(500).send("Internal Server Error");
  }
});