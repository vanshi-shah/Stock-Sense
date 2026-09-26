const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const { getKpis, getStockChart } = require('../controllers/dashboard.controller');

const router = Router();

router.use(requireAuth);

router.get('/kpis', getKpis);
router.get('/stock-chart', getStockChart);

module.exports = router;
