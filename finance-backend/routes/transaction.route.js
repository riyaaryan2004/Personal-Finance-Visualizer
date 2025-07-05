const express = require('express');
const router = express.Router();

const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transaction.controller');

router.get('/', getTransactions);
router.post('/', addTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
