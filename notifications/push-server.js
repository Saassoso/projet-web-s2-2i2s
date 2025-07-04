import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// In need of a database chawki Task
let users = [];

// Sub : add the api call
app.post('/subscribe', (req, res) => {
  const { userId, favoriteTeam } = req.body;
  users.push({ userId, favoriteTeam });
  console.log(`${userId} subscribed for ${favoriteTeam} notifications`);
  res.json({ success: true });
});

// Send notification for the favorite team
app.post('/notify', (req, res) => {
  const { team, message } = req.body;
  const fans = users.filter(user => user.favoriteTeam === team);
  console.log(`Sending notification to ${fans.length} ${team} fans: ${message}`);
  res.json({ sent: fans.length });
});

app.listen(3002, () => console.log('Push server running on port 3002'));