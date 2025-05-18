// routes/creditScoreRoutes.js
const express = require('express');
const { generateScore, getScore } = require('../controllers/creditScoreController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/calculate', protect, generateScore);
router.get('/me', protect, getScore);

module.exports = router;
