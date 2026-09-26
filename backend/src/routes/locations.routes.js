const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  listAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} = require('../controllers/warehouses.controller');

const router = Router();

router.use(requireAuth);

router.get('/', listAllLocations);
router.post('/', createLocation);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);

module.exports = router;
