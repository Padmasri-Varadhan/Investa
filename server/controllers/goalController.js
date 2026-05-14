const Goal = require('../models/Goal');

/**
 * @desc    Get all goals for current user
 * @route   GET /api/goals
 * @access  Private
 */
const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user.id });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Create a new goal
 * @route   POST /api/goals
 * @access  Private
 */
const createGoal = async (req, res) => {
    try {
        const goal = await Goal.create({
            ...req.body,
            userId: req.user.id
        });
        res.status(201).json(goal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Update a goal
 * @route   PUT /api/goals/:id
 * @access  Private
 */
const updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        
        if (goal.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Delete a goal
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        if (goal.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await goal.deleteOne();
        res.json({ message: 'Goal removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };
