const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  listOperations,
  getOperation,
  createOperation,
  updateOperation,
  validateOp,
  cancelOp,
} = require('../controllers/operations.controller');

const router = Router();

router.use(requireAuth);

router.get('/', listOperations);
router.get('/:id', getOperation);
router.post('/', createOperation);
router.put('/:id', updateOperation);
router.post('/:id/validate', validateOp);
router.post('/:id/cancel', cancelOp);

module.exports = router;
