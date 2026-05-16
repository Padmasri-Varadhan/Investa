const express = require('express');
const router = express.Router();
const { 
    queryChatbot, 
    getConversations, 
    getMessages, 
    deleteConversation, 
    renameConversation 
} = require('../controllers/chatbotController');
const protect = require('../middleware/authMiddleware');

router.post('/query', protect, queryChatbot);
router.get('/conversations', protect, getConversations);
router.get('/conversations/:id/messages', protect, getMessages);
router.delete('/conversations/:id', protect, deleteConversation);
router.put('/conversations/:id', protect, renameConversation);

module.exports = router;
