import mongoose from 'mongoose';

const userMatchRequestSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  topic: { 
    type: String, 
    required: true 
  },
  difficulty: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
});

export const UserMatchRequest = mongoose.model('UserMatchRequest', userMatchRequestSchema);