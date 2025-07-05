const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  category: {
    type: String,
    enum: ['Food', 'Rent', 'Transport', 'Utilities','Health', 'Shopping','Entertainment', 'Other'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
