const Transaction = require('../models/transaction.model');

// GET /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const data = await Transaction.find(); // Removed userId filtering
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching transactions', error: err });
  }
};

// POST /api/transactions
exports.addTransaction = async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;

    if (!amount || !category || !date) {
      return res.status(400).json({ message: 'amount, category, and date are required' });
    }

    const transaction = new Transaction({ amount, category, date, description });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error('[Add Transaction Error]:', err); 
    res.status(500).json({ message: 'Error adding transaction', error: err.message }); 
  }
};

// PUT /api/transactions/:id
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Transaction.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating transaction', error: err });
  }
};

// DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting transaction', error: err });
  }
};
