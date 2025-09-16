const express = require('express');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.json({
      success: true,
      data: { expenses }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses'
    });
  }
});

// Create expense
router.post('/', async (req, res) => {
  try {
    const { description, amount, date, category } = req.body;

    if (!description || !amount || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide description, amount, and date'
      });
    }

    const expense = await Expense.create({
      description,
      amount: parseFloat(amount),
      date: new Date(date),
      category: category || 'Other',
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: { expense }
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating expense'
    });
  }
});

// Delete multiple expenses
router.delete('/bulk', async (req, res) => {
  try {
    const { expenseIds } = req.body;

    if (!expenseIds || !Array.isArray(expenseIds) || expenseIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide expense IDs to delete'
      });
    }

    await Expense.deleteMany({
      _id: { $in: expenseIds },
      user: req.user._id
    });

    res.json({
      success: true,
      message: `${expenseIds.length} expenses deleted successfully`
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting expenses'
    });
  }
});

module.exports = router;
