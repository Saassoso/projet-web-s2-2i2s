const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addPreference, removePreference } = require('../controllers/preferencesController');

router.post('/', auth, addPreference);
router.delete('/', auth, removePreference);

module.exports = router;