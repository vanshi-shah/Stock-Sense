const { supabaseAdmin } = require('../lib/supabaseAdmin');
const { asyncHandler } = require('../utils/asyncHandler');
const {
  createWarehouseSchema,
  updateWarehouseSchema,
  createLocationSchema,
  updateLocationSchema,
} = require('../schemas/warehouse.schema');

// ─────────────────────────────────────────────
// WAREHOUSES
// ─────────────────────────────────────────────

/**
 * GET /api/warehouses
 */
const listWarehouses = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('warehouses')
    .select('*, locations(count)')
    .order('name', { ascending: true });

  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, data });
});

/**
 * GET /api/warehouses/:id
 */
const getWarehouse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabaseAdmin
    .from('warehouses')
    .select('*, locations(*)')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ success: false, error: 'Warehouse not found' });
  return res.json({ success: true, data });
});

/**
 * POST /api/warehouses
 */
const createWarehouse = asyncHandler(async (req, res) => {
  const body = createWarehouseSchema.parse(req.body);
  const { data, error } = await supabaseAdmin.from('warehouses').insert(body).select().single();
  if (error) return res.status(400).json({ success: false, error: error.message });
  return res.status(201).json({ success: true, data });
});

/**
 * PUT /api/warehouses/:id
 */
const updateWarehouse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = updateWarehouseSchema.parse(req.body);

  const { data, error } = await supabaseAdmin
    .from('warehouses')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });
  if (!data) return res.status(404).json({ success: false, error: 'Warehouse not found' });
  return res.json({ success: true, data });
});

/**
 * DELETE /api/warehouses/:id
 */
const deleteWarehouse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Block if it has locations with stock
  const { count } = await supabaseAdmin
    .from('locations')
    .select('id', { count: 'exact', head: true })
    .eq('warehouse_id', id);

  if (count > 0) {
    return res.status(409).json({
      success: false,
      error: 'Cannot delete warehouse: it still has locations. Remove them first.',
    });
  }

  const { error } = await supabaseAdmin.from('warehouses').delete().eq('id', id);
  if (error) return res.status(400).json({ success: false, error: error.message });
  return res.json({ success: true, message: 'Warehouse deleted' });
});

// ─────────────────────────────────────────────
// LOCATIONS (nested under warehouses)
// ─────────────────────────────────────────────

/**
 * GET /api/warehouses/:id/locations
 */
const listLocations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabaseAdmin
    .from('locations')
    .select('*')
    .eq('warehouse_id', id)
    .order('name', { ascending: true });

  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, data });
});

/**
 * GET /api/locations — flat list of all locations
 */
const listAllLocations = asyncHandler(async (req, res) => {
  const { warehouse_id } = req.query;
  let query = supabaseAdmin
    .from('locations')
    .select('*, warehouses(name)')
    .order('name', { ascending: true });

  if (warehouse_id) query = query.eq('warehouse_id', warehouse_id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, data });
});

/**
 * POST /api/locations
 */
const createLocation = asyncHandler(async (req, res) => {
  const body = createLocationSchema.parse(req.body);
  const { data, error } = await supabaseAdmin.from('locations').insert(body).select().single();
  if (error) return res.status(400).json({ success: false, error: error.message });
  return res.status(201).json({ success: true, data });
});

/**
 * PUT /api/locations/:id
 */
const updateLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = updateLocationSchema.parse(req.body);

  const { data, error } = await supabaseAdmin
    .from('locations')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });
  if (!data) return res.status(404).json({ success: false, error: 'Location not found' });
  return res.json({ success: true, data });
});

/**
 * DELETE /api/locations/:id
 */
const deleteLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Block if stock_quantities has stock here
  const { data: stock } = await supabaseAdmin
    .from('stock_quantities')
    .select('quantity')
    .eq('location_id', id);

  const totalStock = (stock || []).reduce((sum, sq) => sum + (sq.quantity || 0), 0);
  if (totalStock > 0) {
    return res.status(409).json({
      success: false,
      error: 'Cannot delete location: it still holds stock',
    });
  }

  const { error } = await supabaseAdmin.from('locations').delete().eq('id', id);
  if (error) return res.status(400).json({ success: false, error: error.message });
  return res.json({ success: true, message: 'Location deleted' });
});

module.exports = {
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
};
