const axios = require('axios');
const User = require('../models/user');

class NotificationService {
  constructor() {
    this.lastChecked = new Date();
  }

  async checkForUpdates() {
    try {
      const users = await User.find({ 
        teamSubscriptions: { $exists: true, $ne: [] } 
      });

      for (const user of users) {
        for (const teamName of user.teamSubscriptions) {
          await this.checkTeamMatches(user._id, teamName);
        }
      }
    } catch (error) {
      console.error('Notification check error:', error);
    }
  }

  async checkTeamMatches(userId, teamName) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get('https://api.football-data.org/v4/matches', {
        headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY },
        params: { 
          dateFrom: today,
          dateTo: today
        }
      });

      const matches = response.data.matches.filter(match => 
        match.homeTeam.name.toLowerCase().includes(teamName.toLowerCase()) ||
        match.awayTeam.name.toLowerCase().includes(teamName.toLowerCase())
      );

      for (const match of matches) {
        await this.processMatch(userId, match, teamName);
      }
    } catch (error) {
      console.error('Team match check error:', error);
    }
  }

  async processMatch(userId, match, teamName) {
    const notifications = [];

    // Match started
    if (match.status === 'IN_PLAY') {
      notifications.push({
        userId,
        type: 'MATCH_STARTED',
        message: `${match.homeTeam.name} vs ${match.awayTeam.name} has started!`,
        matchId: match.id
      });
    }

    // Match ended
    if (match.status === 'FINISHED') {
      notifications.push({
        userId,
        type: 'MATCH_ENDED',
        message: `${match.homeTeam.name} ${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam} ${match.awayTeam.name}`,
        matchId: match.id
      });
    }

    // Goals scored
    if (match.status === 'IN_PLAY' && match.score.fullTime.homeTeam + match.score.fullTime.awayTeam > 0) {
      notifications.push({
        userId,
        type: 'GOAL',
        message: `Goal! ${match.homeTeam.name} ${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam} ${match.awayTeam.name}`,
        matchId: match.id
      });
    }

    for (const notification of notifications) {
      console.log(`Notification for user ${userId}:`, notification.message);
    }
  }
}

const notificationService = new NotificationService();

// Call this every 5 minutes
setInterval(() => {
  notificationService.checkForUpdates();
}, 5 * 60 * 1000);

module.exports = notificationService;