const mongoose = require('mongoose');

/**
 * InvestmentIdea Model
 * Stores suggested investment strategies with full detail fields.
 */
const investmentIdeaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        // Full long-form explanation shown on the detail page
        content: {
            type: String,
            default: '',
        },
        riskLevel: {
            type: String,
            enum: ['low', 'medium', 'high'],
            required: [true, 'Risk level is required'],
        },
        expectedReturn: {
            type: String,
            default: '',
        },
        // Alias used in detail view (maps to expectedReturn)
        expectedReturns: {
            type: String,
            default: '',
        },
        timeHorizon: {
            type: String,
            default: '',
        },
        investmentHorizon: {
            type: String,
            enum: ['short_term', 'medium_term', 'long_term', ''],
            default: '',
        },
        category: {
            type: String,
            enum: ['stocks', 'bonds', 'crypto', 'real_estate', 'etf', 'mutual_fund', 'index_fund'],
            default: 'stocks',
        },
        suitableFor: {
            type: String,
            enum: ['beginner', 'some_experience', 'experienced', 'all'],
            default: 'all',
        },
        allocation: {
            type: Number,
            min: 0,
            max: 100,
        },
        // Advantages of this investment strategy
        pros: {
            type: [String],
            default: [],
        },
        // Risks / disadvantages
        cons: {
            type: [String],
            default: [],
        },
        // Searchable tags
        tags: {
            type: [String],
            default: [],
        },
        imageUrl: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('InvestmentIdea', investmentIdeaSchema);
