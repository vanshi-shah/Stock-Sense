const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  listWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  listLocations,
  listAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} = require('../controllers/warehouses.controller');

const router = Router();

router.use(requireAuth);

// Warehouse CRUD
router.get('/', listWarehouses);
router.get('/:id', getWarehouse);
router.post('/', createWarehouse);
router.put('/:id', updateWarehouse);
router.delete('/:id', deleteWarehouse);

// Locations nested under warehouse
router.get('/:id/locations', listLocations);

module.exports = router;
