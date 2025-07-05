const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Food', 'Rent', 'Transport', 'Utilities','Health', 'Shopping','Entertainment', 'Other'],
    required: true,
  },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // Format: "2025-07"
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
