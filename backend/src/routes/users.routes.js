const { Router } = require('express');
const { requireAuth, requireManager } = require('../middleware/auth');
const {
  listUsers,
  updateUserRole,
} = require('../controllers/users.controller');

const router = Router();

router.use(requireAuth);
router.use(requireManager);

router.get('/', listUsers);
router.put('/:id/role', updateUserRole);

module.exports = router;
