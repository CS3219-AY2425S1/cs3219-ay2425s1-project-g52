import { QuestionAttemptsHistory } from "./models/question-attempts-history.js";
import axios from "axios";

// To add a new attempt
async function addAttemptHistory(attemptData) {
  const newAttemptHistory = new QuestionAttemptsHistory(attemptData);
  await newAttemptHistory.save();
}

// To get the attempt history of a user
async function getAttemptHistoryByUserId(userId) {
  const attemptHistories = await QuestionAttemptsHistory.find({ user_ids: userId });

  // Populate the attempts with question details
  const populatedHistories = [];
  for (const attempt of attemptHistories) {
    try {
      const question_id= attempt.question_id;
      const questionResponse = await axios.get(`http://question-service:8000/api/v1/questions/${question_id}`);
      const question = questionResponse.data;
      const populatedAttempt = {
        attempt_id: attempt.attempt_id,
        date: new Date(attempt.first_attempt_date).toLocaleDateString('en-SG', { timeZone: 'Asia/Singapore' }),
        time: new Date(attempt.first_attempt_date).toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore' }),
        title: question.qTitle,
        difficulty: question.qComplexity,
        topic: question.qCategory.join(", "),
        partner: attempt.user_ids.find((user) => user !== userId),
        description: question.qDescription,
        code_contents: attempt.code_contents,
        solution_code: question.qSolution,
        whiteboard_state: attempt.whiteboard_state,
      };
      populatedHistories.push(populatedAttempt);
    } catch (error) {
      console.error(`Failed to fetch question details for question_id ${attempt.question_id}:`, error);
      const populatedAttempt = {
        attempt_id: attempt.attempt_id,
        date: new Date(attempt.first_attempt_date).toLocaleDateString('en-SG', { timeZone: 'Asia/Singapore' }),
        time: new Date(attempt.first_attempt_date).toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore' }),
        title: null,
        difficulty: null,
        topic: null,
        partner: attempt.user_ids.find((user) => user !== userId),
        description: null,
        code_contents: attempt.code_contents,
        solution_code: null,
        whiteboard_state: attempt.whiteboard_state,
      };
      populatedHistories.push(populatedAttempt);
    }
  }

  // Sort the data by date and time
  populatedHistories.sort((attempt1, attempt2) => {
    const attempt1Date = new Date(`${attempt1.date} ${attempt1.time}`).getTime();
    const attempt2Date = new Date(`${attempt2.date} ${attempt2.time}`).getTime();
    return attempt2Date - attempt1Date;
  });

  return populatedHistories;
}

// To update an attempt
async function updateAttemptHistory(attemptId, updateData) {
  return QuestionAttemptsHistory.findOneAndUpdate({ attempt_id: attemptId }, updateData, { new: true });
}

export {
  addAttemptHistory,
  getAttemptHistoryByUserId,
  updateAttemptHistory
};