const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const { listStockQuantities } = require('../controllers/stockmoves.controller');

const router = Router();

router.use(requireAuth);

router.get('/', listStockQuantities);

module.exports = router;
