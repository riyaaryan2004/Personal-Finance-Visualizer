const Budget = require('../models/budget.model');

// GET /api/budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ month: 1 });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

// POST /api/budgets
// Body: { category, amount, month }
exports.addOrUpdateBudget = async (req, res) => {
  try {
    const { category, amount, month } = req.body;

    if (!category || !amount || !month) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await Budget.findOne({ category, month });

    if (existing) {
      // Update existing budget
      existing.amount = amount;
      await existing.save();
      return res.status(200).json({ message: 'Budget updated', budget: existing });
    } else {
      // Create new budget
      const budget = new Budget({ category, amount, month });
      await budget.save();
      return res.status(201).json({ message: 'Budget created', budget });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to add/update budget' });
  }
};

// DELETE /api/budgets/:id
exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Budget.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
};
