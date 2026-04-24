const express = require('express');
const router = express.Router();
const { getInvestmentIdeas, getIdeaById } = require('../controllers/investmentController');

// Public routes
router.get('/', getInvestmentIdeas);
router.get('/:id', getIdeaById);

module.exports = router;
