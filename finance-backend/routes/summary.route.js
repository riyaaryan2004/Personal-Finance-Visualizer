const express = require('express');
const router = express.Router();
const {
  getOverview,
  getCategoryBreakdown,
  getBudgetVsActual
} = require('../controllers/summary.controller');

router.get('/overview', getOverview);
router.get('/category', getCategoryBreakdown);
router.get('/budget-vs-actual', getBudgetVsActual);

module.exports = router;
