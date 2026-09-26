const { supabaseAdmin } = require('../lib/supabaseAdmin');
const { asyncHandler } = require('../utils/asyncHandler');

/**
 * GET /api/stock-moves
 * Immutable ledger of all stock movements.
 * Query params: product_id, operation_id, from_date, to_date, limit, offset
 */
const listStockMoves = asyncHandler(async (req, res) => {
  const { product_id, operation_id, from_date, to_date, limit = 50, offset = 0 } = req.query;

  let query = supabaseAdmin
    .from('stock_moves')
    .select(`
      *,
      operations ( id, type, status, reference_document ),
      products ( id, name, sku ),
      from_location:from_location_id ( id, name, warehouses(name) ),
      to_location:to_location_id ( id, name, warehouses(name) )
    `, { count: 'exact' })
    .order('timestamp', { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  if (product_id) query = query.eq('product_id', product_id);
  if (operation_id) query = query.eq('operation_id', operation_id);
  if (from_date) query = query.gte('timestamp', from_date);
  if (to_date) query = query.lte('timestamp', to_date);

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ success: false, error: error.message });

  return res.json({ success: true, data, total: count, limit: Number(limit), offset: Number(offset) });
});

/**
 * GET /api/stock-quantities
 * Current on-hand stock per product per location.
 * Query params: product_id, location_id, warehouse_id, low_stock (boolean)
 */
const listStockQuantities = asyncHandler(async (req, res) => {
  const { product_id, location_id, warehouse_id, low_stock } = req.query;

  let query = supabaseAdmin
    .from('stock_quantities')
    .select(`
      *,
      products ( id, name, sku, reorder_rule, unit_of_measure ),
      locations ( id, name, type, warehouse_id, warehouses(id, name) )
    `);

  if (product_id) query = query.eq('product_id', product_id);
  if (location_id) query = query.eq('location_id', location_id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ success: false, error: error.message });

  let result = data;

  // Filter by warehouse_id through location join
  if (warehouse_id) {
    result = result.filter((sq) => sq.locations?.warehouse_id === warehouse_id);
  }

  // Filter low stock: quantity <= reorder_rule
  if (low_stock === 'true') {
    result = result.filter((sq) => {
      const reorder = sq.products?.reorder_rule;
      return reorder !== null && reorder !== undefined && sq.quantity <= reorder;
    });
  }

  return res.json({ success: true, data: result, total: result.length });
});

module.exports = { listStockMoves, listStockQuantities };
