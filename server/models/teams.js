const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamsController'); // adjust if path differs

// Route: GET /teams/search?name=...
router.get('/search', teamController.searchTeamDetailsByName);

module.exports = router;

