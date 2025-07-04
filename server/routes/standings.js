const express = require('express');
const router = express.Router();
const { getStandings } = require('../controllers/standingsController.js');

router.get('/', getStandings);

module.exports = router;
