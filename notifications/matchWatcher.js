class MatchWatcher {
  constructor() {
    this.matches = [];
  }

  // Simulate a live match
  startMatch(homeTeam, awayTeam) {
    console.log(`🏆 Starting ${homeTeam} vs ${awayTeam}`);
    
    // Send match start notification
    this.sendNotification(homeTeam, `${homeTeam} vs ${awayTeam} started!`);
    this.sendNotification(awayTeam, `${homeTeam} vs ${awayTeam} started!`);

    // Simulate goals every 30 seconds
    let minute = 0;
    const goalTimer = setInterval(() => {
      minute += 15;
      if (minute > 90) {
        clearInterval(goalTimer);
        this.endMatch(homeTeam, awayTeam);
        return;
      }

      // Random goal
      const scorer = Math.random() > 0.5 ? homeTeam : awayTeam;
      const message = `⚽ GOAL! ${scorer} scored in minute ${minute}!`;
      this.sendNotification(scorer, message);
      console.log(message);
    }, 30000); // Every 30 seconds
  }

  endMatch(homeTeam, awayTeam) {
    const message = `🏁 Full Time: ${homeTeam} vs ${awayTeam} finished`;
    this.sendNotification(homeTeam, message);
    this.sendNotification(awayTeam, message);
    console.log(message);
  }

  async sendNotification(team, message) {
    try {
      await fetch('http://localhost:3002/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team, message })
      });
    } catch (error) {
      console.log('Notification error:', error.message);
    }
  }
}

// Start simulator
const watcher = new MatchWatcher();
// Test match every 2 minutes
setInterval(() => {
  const teams = ['Arsenal', 'Chelsea', 'Liverpool', 'ManCity'];
  const home = teams[Math.floor(Math.random() * teams.length)];
  const away = teams[Math.floor(Math.random() * teams.length)];
  if (home !== away) watcher.startMatch(home, away);
}, 120000);

console.log('Match watcher started - will simulate matches every 2 minutes');
