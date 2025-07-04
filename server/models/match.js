const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  matchId: { type: String, required: true, unique: true },
  homeTeam: String,
  awayTeam: String,
  status: String,
  score: {
    home: Number,
    away: Number
  },
  events: [{
    type: String, // 'goal', 'yellow_card', 'red_card', 'substitution'
    minute: Number,
    player: String,
    team: String,
    description: String,
    processed: { type: Boolean, default: false } // Track if notification sent
  }],
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.models.Match || mongoose.model('Match', MatchSchema);