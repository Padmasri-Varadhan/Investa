const mongoose = require('mongoose');

const investmentIdeaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: [true, 'Risk level is required'],
    },
    expectedReturns: {
        type: String,
        default: '',
    },
    horizon: {
        type: String,
        default: '',
    },
    overview: {
        type: String,
        default: '',
    },
    pros: {
        type: [String],
        default: [],
    },
    cons: {
        type: [String],
        default: [],
    },
    detailedContent: {
        type: String,
        required: [true, 'Detailed content is required'],
    },
}, { timestamps: true });

module.exports = mongoose.model('InvestmentIdea', investmentIdeaSchema);
