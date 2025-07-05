const Transaction = require('../models/transaction.model');
const Budget = require('../models/budget.model');

// Helper: get month range
function getMonthRange(monthStr) {
  const start = new Date(`${monthStr}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return { start, end };
}

// Helper: get quarter name
function getQuarterName(quarter) {
  switch (quarter) {
    case 1: return '1st Quarter';
    case 2: return '2nd Quarter';
    case 3: return '3rd Quarter';
    case 4: return '4th Quarter';
    default: return `${quarter}th Quarter`;
  }
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

// GET /api/summary/monthly-trends?months=6
exports.getMonthlyTrends = async (req, res) => {
  try {
    const { months = 6 } = req.query;
    const numMonths = parseInt(months);
    
    const trends = [];
    const currentDate = new Date();
    
    for (let i = numMonths - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const monthStr = `${year}-${month}`;
      
      const { start, end } = getMonthRange(monthStr);
      const transactions = await Transaction.find({ 
        date: { $gte: start, $lt: end } 
      });
      
      const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
      
      trends.push({
        month: `${year}-${month}`,
        expenses: totalExpenses
      });
    }
    
    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch monthly trends' });
  }
};

// GET /api/summary/quarterly-trends?quarters=6
exports.getQuarterlyTrends = async (req, res) => {
  try {
    const { quarters = 6 } = req.query;
    const numQuarters = parseInt(quarters);
    
    const trends = [];
    const currentDate = new Date();
    
    console.log('Quarterly trends calculation started');
    
    for (let i = numQuarters - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - (i * 3));
      
      const year = date.getFullYear();
      const month = date.getMonth();
      const quarter = Math.floor(month / 3) + 1;
      
      console.log(`Iteration ${i}: year=${year}, month=${month}, quarter=${quarter}`);
      
      // Calculate quarter start and end dates for the specific quarter
      const quarterStartMonth = (quarter - 1) * 3;
      const quarterStart = new Date(year, quarterStartMonth, 1);
      const quarterEnd = new Date(year, quarterStartMonth + 3, 1);
      
      const transactions = await Transaction.find({ 
        date: { $gte: quarterStart, $lt: quarterEnd } 
      });
      
      const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
      
      const quarterLabel = `${getQuarterName(quarter)} ${year}`;
      console.log(`Quarter label: ${quarterLabel}`);
      
      trends.push({
        month: quarterLabel,
        expenses: totalExpenses
      });
    }
    
    console.log('Final trends:', trends);
    res.json(trends);
  } catch (err) {
    console.error('Quarterly trends error:', err);
    res.status(500).json({ error: 'Failed to fetch quarterly trends' });
  }
};

// GET /api/summary/yearly-trends?years=6
exports.getYearlyTrends = async (req, res) => {
  try {
    const { years = 6 } = req.query;
    const numYears = parseInt(years);
    
    const trends = [];
    const currentDate = new Date();
    
    for (let i = numYears - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setFullYear(date.getFullYear() - i);
      
      const year = date.getFullYear();
      
      // Calculate year start and end dates
      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year + 1, 0, 1);
      
      const transactions = await Transaction.find({ 
        date: { $gte: yearStart, $lt: yearEnd } 
      });
      
      const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
      
      trends.push({
        month: `${year}`,
        expenses: totalExpenses
      });
    }
    
    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch yearly trends' });
  }
};