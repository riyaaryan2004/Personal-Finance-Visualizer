// routes/summary.route.js
const express = require('express');
const router = express.Router();
const {
  getOverview,
  getCategoryBreakdown,
  getBudgetVsActual,
  getMonthlyTrends,
  getQuarterlyTrends,
  getYearlyTrends
} = require('../controllers/summary.controller');

router.get('/overview', getOverview);
router.get('/category', getCategoryBreakdown);
router.get('/budget-vs-actual', getBudgetVsActual);
router.get('/monthly-trends', getMonthlyTrends);
router.get('/quarterly-trends', getQuarterlyTrends);
router.get('/yearly-trends', getYearlyTrends);

module.exports = router;
