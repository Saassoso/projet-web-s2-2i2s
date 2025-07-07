require('dotenv').config();
console.log('API Key Loaded:', process.env.FOOTBALL_API_KEY);
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());


// Routes
const authRoutes = require('./routes/auth');
const matchesRoutes = require('./routes/matches');
const standingsRoutes = require('./routes/standings');
const preferencesRoutes = require('./routes/preferences');
const teamsRoutes = require('./routes/teams');
const predictionRoutes = require('./routes/predictions');
const notificationService = require('./services/NotificationService');

// Start notification service
app.use('/auth', authRoutes);
app.use('/matches', matchesRoutes);
app.use('/standings', standingsRoutes);
app.use('/preferences', preferencesRoutes);
app.use('/teams', teamsRoutes);
app.use('/predictions', predictionRoutes);

const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));