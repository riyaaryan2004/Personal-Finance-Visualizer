const express = require('express');
const cors = require('cors');

const transactionRoutes = require('./routes/transaction.route');
const budgetRoutes = require('./routes/budget.route');
const summaryRoutes = require('./routes/summary.route');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/summary', summaryRoutes);

app.get('/', (req, res) => {
  res.send('💸 Personal Finance Visualizer Backend is running!');
});

module.exports = app;
