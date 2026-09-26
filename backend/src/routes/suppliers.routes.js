const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  listSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/suppliers.controller');

const router = Router();

router.use(requireAuth);

router.get('/', listSuppliers);
router.get('/:id', getSupplier);
router.post('/', createSupplier);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

module.exports = router;
