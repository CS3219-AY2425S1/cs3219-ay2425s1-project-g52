import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { addAttemptHistory, getAttemptHistoryByUserId, updateAttemptHistory } from "./history-service.js";

dotenv.config();

const app = express();

const connectionURL = process.env.ATLAS_URI || "";

// Connec to MongoDB database
mongoose
  .connect(connectionURL)
  .then(() => console.log("Database connected.."))
  .catch((e) => {
    console.error("Database connection failed:", e);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

// api route to add a new attempt
app.post('/history/add', async (req, res) => {
  try {
    await addAttemptHistory(req.body);
    res.status(201).send('New attempt added to history');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// api to get all attempts by a user
app.get('/history/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const history = await getAttemptHistoryByUserId(userId);
    res.json(history);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// api to update an attempt with the attemptId
app.put('/history/update/:attemptId', async (req, res) => {
  try {
    const attemptId = req.params.attemptId;
    const updateData = req.body;
    await updateAttemptHistory(attemptId, updateData);
    res.status(200).send('History updated');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`History service running on port ${PORT}`));