import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {connectRabbitMQ, getChannel} from "./connections.js";
import {addUser, checkForMatches, requeueUser, removeUserFromAllQueues} from "./match-queue.js";
import {initializeWebSocketServer} from "./websocket.js";
import {TOPICS, DIFFICULTIES} from './constants/constants.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

initializeWebSocketServer(process.env.WEBSOCKET_PORT || 8080);

async function initialize() {
  try {
    await connectRabbitMQ();
    const channel = getChannel();
    await initializeMatchQueue(channel);
    console.log("All services initialized successfully");
    await processMatchRequests(channel);
    app.listen(process.env.MATCHING_SERVICE_PORT);
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
}

// Initialize the match queues
async function initializeMatchQueue(channel) {
  for (const topic of TOPICS) {
    const topicQueueName = `${topic}_queue`;
    await channel.assertQueue(topicQueueName, { durable: true });
    console.log(`Queue ${topicQueueName} initialized`);

    for (const difficulty of DIFFICULTIES) {
      const difficultyQueueName = `${topic}_${difficulty}_queue`;
      await channel.assertQueue(difficultyQueueName, { durable: true });
      console.log(`Queue ${difficultyQueueName} initialized`);
    }
  }
  console.log("Match queues initialized");
}

// To process match requests
async function processMatchRequests(channel) {
  channel.prefetch(1);
  for(const topic of TOPICS) {
    const queueName = `${topic}_queue`;
    await channel.consume(queueName, async function(request) {
      if (request) {
        const matchRequest = JSON.parse(request.content.toString());
        console.log('Received match request: ', matchRequest);
        const matched = await checkForMatches(matchRequest, channel);
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
}

initialize();

// api to add a user to the match queue
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

// api to remove a user from all queues
app.delete("/match/:userId", async (req, res) => {
  const userId = req.params.userId;
  const {topic, difficulty} = req.body;
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