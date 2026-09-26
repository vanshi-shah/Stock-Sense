const { Router } = require('express');
const { requireAuth, requireStaff, requireManager } = require('../middleware/auth');
const {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categories.controller');

const router = Router();

router.use(requireAuth);

router.get('/', requireStaff, listCategories);
router.get('/:id', requireStaff, getCategory);
router.post('/', requireManager, createCategory);
router.put('/:id', requireManager, updateCategory);
router.delete('/:id', requireManager, deleteCategory);

module.exports = router;
