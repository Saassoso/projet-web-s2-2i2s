class Notifier {
  constructor(webPush) {
    this.webPush = webPush;
    this.subscriptions = new Map();
    this.userPreferences = new Map();
  }

  addSubscription(userId, subscription) {
    this.subscriptions.set(userId, subscription);
    console.log(`📱 Added subscription for user ${userId}`);
  }

  updateUserPreferences(userId, preferences) {
    this.userPreferences.set(userId, preferences);
    console.log(`⚙️ Updated preferences for user ${userId}:`, preferences);
  }

  async notifyMatchStarting(match) {
    const message = {
      title: '⚽ Match dans 10 minutes !',
      body: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: {
        type: 'match_starting',
        matchId: match.id,
        url: `/matches/${match.id}`
      },
      actions: [
        {
          action: 'view',
          title: 'Voir le match',
          icon: '/icons/view.png'
        }
      ]
    };

    await this.sendToInterestedUsers(match, message);
  }

  async notifyMatchStarted(match) {
    const message = {
      title: '🚀 Match commencé !',
      body: `${match.homeTeam.name} vs ${match.awayTeam.name} - LIVE`,
      icon: '/icons/icon-192x192.png',
      data: {
        type: 'match_started',
        matchId: match.id,
        url: `/matches/${match.id}`
      }
    };

    await this.sendToInterestedUsers(match, message);
  }

  async notifyMatchEvents(match) {
    // Simuler des événements (en production, récupérer les vrais événements)
    if (Math.random() < 0.1) { // 10% de chance d'événement
      const events = ['goal', 'red_card', 'penalty'];
      const event = events[Math.floor(Math.random() * events.length)];
      
      let message;
      switch (event) {
        case 'goal':
          message = {
            title: '⚽ GOOOOOL !',
            body: `But dans ${match.homeTeam.name} vs ${match.awayTeam.name}`,
            data: { type: 'goal', matchId: match.id }
          };
          break;
        case 'red_card':
          message = {
            title: '🟥 Carton Rouge !',
            body: `Expulsion dans ${match.homeTeam.name} vs ${match.awayTeam.name}`,
            data: { type: 'red_card', matchId: match.id }
          };
          break;
        case 'penalty':
          message = {
            title: '🎯 Penalty !',
            body: `Penalty accordé dans ${match.homeTeam.name} vs ${match.awayTeam.name}`,
            data: { type: 'penalty', matchId: match.id }
          };
          break;
      }
      
      await this.sendToInterestedUsers(match, message);
    }
  }

  async sendToInterestedUsers(match, message) {
    const homeTeamId = match.homeTeam.id;
    const awayTeamId = match.awayTeam.id;
    
    for (const [userId, preferences] of this.userPreferences) {
      if (preferences.notifications && 
          preferences.teams && 
          (preferences.teams.includes(homeTeamId) || preferences.teams.includes(awayTeamId))) {
        
        await this.sendNotification(userId, message);
      }
    }
  }

  async sendNotification(userId, message) {
    const subscription = this.subscriptions.get(userId);
    if (!subscription) {
      console.log(`⚠️ No subscription found for user ${userId}`);
      return;
    }

    try {
      await this.webPush.sendNotification(subscription, JSON.stringify(message));
      console.log(`✅ Notification sent to user ${userId}: ${message.title}`);
    } catch (error) {
      console.error(`❌ Failed to send notification to user ${userId}:`, error);
      
      // Handle subscription errors
      if (error.statusCode === 410) {
        this.subscriptions.delete(userId);
        console.log(`🗑️ Removed invalid subscription for user ${userId}`);
      }
    }
  }

  async sendTestNotification(userId) {
    const message = {
      title: '🧪 Test Notification',
      body: 'Si vous voyez ceci, les notifications fonctionnent parfaitement !',
      icon: '/icons/icon-192x192.png',
      data: { type: 'test' }
    };

    await this.sendNotification(userId, message);
  }
}

export default Notifier;