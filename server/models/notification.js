const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['GOAL', 'MATCH_STARTED', 'MATCH_ENDED', 'RED_CARD'], required: true },
  message: { type: String, required: true },
  matchId: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});