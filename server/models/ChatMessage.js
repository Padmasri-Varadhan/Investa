const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatConversation',
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'bot'],
        required: true
    },
    text: {
        type: String,
        required: true
    },
    complexity: String,
    recommendedModule: String,
    suggestedFollowUps: [String],
    quickActions: [{
        label: String,
        action: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
