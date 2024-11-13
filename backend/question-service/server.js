import express from "express";
import mongoose from "mongoose";
import Question from "./questionModel.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

//app config
const app = express();
const port = process.env.PORT || 8000;

//middleware
app.use(express.json());
app.use(cors());

//DB Config
const connectionURL = process.env.ATLAS_URI || "";
mongoose
  .connect(connectionURL)
  .then(() => console.log("Database connected.."))
  .catch((e) => {
    console.error("Database connection failed:", e);
    process.exit(1);
  });

//ROOT
app.get("/", (_, res) => {
  res.send("Welcome to the PeerPrep Questions API!");
});

//api routes(CRUD Calls)
app.get("/api/v1/questions", async (_, res) => {
  try {
    const questions = await Question.find({});
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.get("/api/v1/questions/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ message: "An error occurred: " + err.message });
  }
});

app.post("/api/v1/questions", async (req, res) => {
  try {
    const question = new Question(req.body);

    await question.save();
    res.status(201).location(`/questions/${question.id}`).json(question);
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while adding the question." + err.message,
    });
  }
});

app.delete("/api/v1/questions/:id", async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);

    if (!deletedQuestion) {
      return res.status(404).json({ error: "Question not found." });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while deleting the question:" + err.message,
    });
  }
});

app.patch("/api/v1/questions/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while editing the question:" + err.message,
    });
  }
});

app.get("/questions", async (req, res) => {
  // Use req.query instead of req.body for GET requests
  const { category, difficulty } = req.query;
  console.log("category:", category, "difficulty:", difficulty);

  try {
    // Construct the query to check if the category is in the array and match the difficulty exactly
    const query = {
      qCategory: { $in: [category] }, // Check if the category is in the qCategory array
      qComplexity: difficulty, // Exact match for difficulty
    };

    const questions = await Question.find(query);
    console.log("questions:", questions);

    if (questions.length === 0) {
      return res.status(404).json({ error: "No questions found" });
    }

    // Select a random question from the list
    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomQuestion = questions[randomIndex];

    res.status(200).json(randomQuestion); // Return the random question
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

app.listen(port, () => console.log(`Listening on localhost:${port}`));
