const Article = require('../models/Article');

const getArticles = async (req, res) => {
    try {
        const { search, risk, category, sort, page = 1, limit = 10 } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { summary: { $regex: search, $options: 'i' } },
                { fullContent: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
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

        const articles = await Article.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Article.countDocuments(query);

        res.json({
            data: articles,
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

const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createArticle = async (req, res) => {
    try {
        const article = await Article.create(req.body);
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateArticle = async (req, res) => {
    try {
        const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: 'Article not found' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const deleted = await Article.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Article not found' });
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getArticles, getArticleById, createArticle, updateArticle, deleteArticle };
