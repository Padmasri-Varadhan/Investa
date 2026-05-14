const InvestmentIdea = require('../models/InvestmentIdea');

const getInvestmentIdeas = async (req, res) => {
    try {
        const { search, risk, category, sort, page = 1, limit = 10 } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { overview: { $regex: search, $options: 'i' } },
                { detailedContent: { $regex: search, $options: 'i' } }
            ];
        }

        if (risk) query.riskLevel = risk;
        if (category) query.category = category;

        let sortObj = { createdAt: -1 };
        if (sort) {
            const parts = sort.split(',');
            sortObj = { [parts[0]]: parts[1] === '1' ? 1 : -1 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const ideas = await InvestmentIdea.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await InvestmentIdea.countDocuments(query);

        res.json({
            data: ideas,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getIdeaById = async (req, res) => {
    try {
        const idea = await InvestmentIdea.findById(req.params.id);
        if (!idea) return res.status(404).json({ message: 'Investment idea not found' });
        res.json(idea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getInvestmentIdeas, getIdeaById };
