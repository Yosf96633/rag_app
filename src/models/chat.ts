// models/ChatSession.ts
import mongoose, { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChatSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'New Chat' }, // Optional title
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
});

export const ChatSession = models.ChatSession || model('ChatSession', ChatSessionSchema);
