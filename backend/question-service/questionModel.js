import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  qId: {
    type: Number,
    required: true,
  },
  qTitle: {
    type: String,
    required: true,
  },
  qDescription: {
    type: String,
    required: true,
  },
  qCategory: {
    type: [String], // Array of strings
    required: true,
  },
  qComplexity: {
    type: String,
    required: true,
  },
  qSolution: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Question", questionSchema);
