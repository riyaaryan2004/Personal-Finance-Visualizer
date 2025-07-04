const Transaction =require('../models/transaction.model');

exports.getTransactions = async (req, res) => {
  const userId = req.query.userId;
  const data = await Transaction.find({ userId });
  res.json(data);
};

exports.addTransaction = async (req, res) => {
  const { userId, amount, category, date, description } = req.body;
  const transaction = new Transaction({ userId, amount, category, date, description });
  await transaction.save();
  res.status(201).json(transaction);
};
