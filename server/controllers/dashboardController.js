const Holding = require('../models/Holding');
const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');

/**
 * @desc    Get dashboard summary, holdings, and transactions
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch user data
        let holdings = await Holding.find({ userId });
        let transactions = await Transaction.find({ userId }).sort({ date: -1 }).limit(10);
        let goals = await Goal.find({ userId });

        // If no data exists, we could return some starting "tutorial" data or empty
        // For a "fully dynamic" feel, let's calculate totals
        
        let totalValue = 0;
        let investedAmount = 0;
        
        holdings.forEach(h => {
            totalValue += h.quantity * h.currentPrice;
            investedAmount += h.quantity * h.averagePrice;
        });

        const totalProfit = totalValue - investedAmount;
        const totalProfitPercent = investedAmount > 0 ? (totalProfit / investedAmount) * 100 : 0;

        // Calculate Allocation
        const allocationMap = {};
        holdings.forEach(h => {
            allocationMap[h.assetType] = (allocationMap[h.assetType] || 0) + (h.quantity * h.currentPrice);
        });

        const allocationLabels = Object.keys(allocationMap);
        const allocationValues = allocationLabels.map(label => {
            return (allocationMap[label] / totalValue) * 100;
        });

        res.json({
            portfolio: {
                totalValue,
                investedAmount,
                totalProfit,
                totalProfitPercent: totalProfitPercent.toFixed(2),
                todayGain: 0, // In a real app, this would compare with yesterday's close
                todayGainPercent: 0
            },
            holdings: holdings.map(h => ({
                id: h._id,
                name: h.name,
                type: h.assetType,
                qty: h.quantity,
                buyPrice: h.averagePrice,
                currentPrice: h.currentPrice,
                profit: (h.currentPrice - h.averagePrice) * h.quantity,
                profitPercent: (((h.currentPrice - h.averagePrice) / h.averagePrice) * 100).toFixed(2)
            })),
            transactions: transactions.map(t => ({
                id: t._id,
                type: t.type,
                asset: t.assetName,
                amount: t.amount,
                date: t.date.toISOString().split('T')[0],
                status: t.status
            })),
            allocation: {
                labels: allocationLabels,
                datasets: [{
                    data: allocationValues,
                    backgroundColor: ['#007DA3', '#059669', '#F59E0B', '#6366F1', '#9CA3AF'],
                    borderWidth: 0,
                }]
            },
            goals: goals.map(g => ({
                id: g._id,
                title: g.title,
                target: g.targetAmount,
                current: g.currentAmount,
                progress: ((g.currentAmount / g.targetAmount) * 100).toFixed(0)
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardData };
