const express = require('express');
const router = express.Router();
const { getPrediction } = require('../controllers/predictionController');

router.get('/', getPrediction);
module.exports = router;
// This file defines the route for fetching predictions.
// It uses the predictionController to handle the logic for getting predictions.
// The route is set up to respond to GET requests at the root path of the predictions endpoint.