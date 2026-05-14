const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema(
    {
        intent: {
            type: String,
            required: true,
            unique: true,
        },
        keywords: [{
            type: String,
        }],
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
            category: {
            type: String,
            enum: ['Assets', 'Strategies', 'Planning', 'Website', 'General'],
            default: 'General',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
