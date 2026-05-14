const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        assetType: {
            type: String,
            enum: ['Stock', 'Mutual Fund', 'Crypto', 'ETF', 'Bond'],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
        },
        averagePrice: {
            type: Number,
            required: true,
            default: 0,
        },
        currentPrice: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Holding', holdingSchema);
