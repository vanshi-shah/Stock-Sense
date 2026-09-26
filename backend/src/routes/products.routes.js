const { Router } = require('express');
const { requireAuth, requireStaff, requireManager } = require('../middleware/auth');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products.controller');

const router = Router();

router.use(requireAuth);

router.get('/', requireStaff, listProducts);
router.get('/:id', requireStaff, getProduct);
router.post('/', requireManager, createProduct);
router.put('/:id', requireManager, updateProduct);
router.delete('/:id', requireManager, deleteProduct);

module.exports = router;
