const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assetName: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['Buy', 'Sell', 'SIP'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        priceAtTransaction: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['Completed', 'Pending', 'Failed'],
            default: 'Completed',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
