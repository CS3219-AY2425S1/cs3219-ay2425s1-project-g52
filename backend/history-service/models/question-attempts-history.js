import mongoose from 'mongoose';

const QuestionAttemptsHistorySchema = new mongoose.Schema({
    attempt_id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    user_ids: { 
        type: [String], 
        required: true 
    },
    question_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question', 
        required: true 
      },
    first_attempt_date: { 
        type: Date, 
        required: true 
    },
    code_contents: { 
        type: String, 
        required: false
    },
    whiteboard_state: { 
        type: mongoose.Schema.Types.Mixed, 
        required: false
    }
  });

  const QuestionAttemptsHistory = mongoose.model("QuestionAttemptsHistory", QuestionAttemptsHistorySchema);

  export { QuestionAttemptsHistory };