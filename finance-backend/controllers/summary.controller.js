const Transaction = require('../models/transaction.model');
const Budget = require('../models/budget.model');

// Helper: get month range
function getMonthRange(monthStr) {
  const start = new Date(`${monthStr}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return { start, end };
}

// GET /api/summary/overview?month=2025-07
exports.getOverview = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) return res.status(400).json({ error: 'month is required' });

    const { start, end } = getMonthRange(month);
    const transactions = await Transaction.find({ date: { $gte: start, $lt: end } }).sort({ date: -1 });

    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    const recentTransactions = transactions.slice(0, 5);

    res.json({ totalExpenses, recentTransactions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
};

// GET /api/summary/category?month=2025-07
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) return res.status(400).json({ error: 'month is required' });

    const { start, end } = getMonthRange(month);
    const transactions = await Transaction.find({ date: { $gte: start, $lt: end } });

    const categoryTotals = {};
    transactions.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const result = Object.entries(categoryTotals).map(([category, amount]) => ({ category, amount }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category breakdown' });
  }
};

// GET /api/summary/budget-vs-actual?month=2025-07
exports.getBudgetVsActual = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) return res.status(400).json({ error: 'month is required' });

    const { start, end } = getMonthRange(month);
    const budgets = await Budget.find({ month });
    const transactions = await Transaction.find({ date: { $gte: start, $lt: end } });

    const actuals = {};
    transactions.forEach((t) => {
      actuals[t.category] = (actuals[t.category] || 0) + t.amount;
    });

    const result = budgets.map((b) => ({
      category: b.category,
      budget: b.amount,
      actual: actuals[b.category] || 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch budget vs actual' });
  }
};