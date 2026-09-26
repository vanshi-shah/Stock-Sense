const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const { listStockMoves, listStockQuantities } = require('../controllers/stockmoves.controller');

const router = Router();

router.use(requireAuth);

// Immutable ledger
router.get('/', listStockMoves);

module.exports = router;
