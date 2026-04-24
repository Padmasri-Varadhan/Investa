const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');
const protect = require('../middleware/authMiddleware');

router.get('/:profileType', protect, getRecommendations);

module.exports = router;
