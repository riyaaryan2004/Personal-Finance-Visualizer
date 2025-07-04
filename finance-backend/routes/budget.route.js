const express = require('express');
const router = express.Router();
const {
  getBudgets,
  addOrUpdateBudget,
  deleteBudget,
} = require('../controllers/budget.controller');

router.get('/', getBudgets);
router.post('/', addOrUpdateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
