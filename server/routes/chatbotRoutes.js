const express = require('express');
const router = express.Router();
const { queryChatbot } = require('../controllers/chatbotController');
const protect = require('../middleware/authMiddleware');

// The chatbot query can be protected to access user-specific data (portfolio/goals)
// If not authenticated, it still works for general Knowledge Base queries (if we allow)
router.post('/query', protect, queryChatbot);

module.exports = router;
