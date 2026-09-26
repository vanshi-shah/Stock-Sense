const { supabaseAdmin } = require('../lib/supabaseAdmin');
const { asyncHandler } = require('../utils/asyncHandler');

/**
 * GET /api/dashboard/kpis
 * Returns all live KPI counts for the dashboard in a single request.
 */
const getKpis = asyncHandler(async (req, res) => {
  // Run all queries in parallel for performance
  const [
    productsResult,
    stockQuantitiesResult,
    pendingReceiptsResult,
    pendingDeliveriesResult,
    pendingTransfersResult,
    pendingAdjustmentsResult,
    recentMovesResult,
  ] = await Promise.all([
    // Total products
    supabaseAdmin.from('products').select('id', { count: 'exact', head: true }),

    // Stock quantities with reorder rule for low stock calc
    supabaseAdmin
      .from('stock_quantities')
      .select('product_id, quantity, products(reorder_rule)'),

    // Pending receipts
    supabaseAdmin
      .from('operations')
      .select('id', { count: 'exact', head: true })
      .eq('type', 'receipt')
      .in('status', ['draft', 'waiting', 'ready']),

    // Pending deliveries
    supabaseAdmin
      .from('operations')
      .select('id', { count: 'exact', head: true })
      .eq('type', 'delivery')
      .in('status', ['draft', 'waiting', 'ready']),

    // Pending transfers
    supabaseAdmin
      .from('operations')
      .select('id', { count: 'exact', head: true })
      .eq('type', 'transfer')
      .in('status', ['draft', 'waiting', 'ready']),

    // Pending adjustments
    supabaseAdmin
      .from('operations')
      .select('id', { count: 'exact', head: true })
      .eq('type', 'adjustment')
      .in('status', ['draft', 'waiting', 'ready']),

    // 5 most recent stock moves for activity feed
    supabaseAdmin
      .from('stock_moves')
      .select(`
        id, quantity, timestamp,
        products(name, sku),
        from_location:from_location_id(name),
        to_location:to_location_id(name),
        operations(type)
      `)
      .order('timestamp', { ascending: false })
      .limit(5),
  ]);

  // Compute low stock count: products where total qty <= reorder_rule
  const stockQtyData = stockQuantitiesResult.data || [];
  // Aggregate total quantity per product
  const productStockMap = {};
  stockQtyData.forEach((sq) => {
    if (!productStockMap[sq.product_id]) {
      productStockMap[sq.product_id] = {
        total: 0,
        reorder_rule: sq.products?.reorder_rule ?? null,
      };
    }
    productStockMap[sq.product_id].total += sq.quantity || 0;
  });

  const lowStockCount = Object.values(productStockMap).filter(
    (p) => p.reorder_rule !== null && p.total <= p.reorder_rule
  ).length;

  return res.json({
    success: true,
    data: {
      total_products: productsResult.count ?? 0,
      low_stock: lowStockCount,
      pending_receipts: pendingReceiptsResult.count ?? 0,
      pending_deliveries: pendingDeliveriesResult.count ?? 0,
      pending_transfers: pendingTransfersResult.count ?? 0,
      pending_adjustments: pendingAdjustmentsResult.count ?? 0,
      recent_moves: recentMovesResult.data || [],
    },
  });
});

/**
 * GET /api/dashboard/stock-chart
 * Returns top 10 products by total stock for chart display.
 */
const getStockChart = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('stock_quantities')
    .select('product_id, quantity, products(name, sku)');

  if (error) return res.status(500).json({ success: false, error: error.message });

  // Aggregate by product
  const productMap = {};
  (data || []).forEach((sq) => {
    if (!productMap[sq.product_id]) {
      productMap[sq.product_id] = {
        product_id: sq.product_id,
        name: sq.products?.name || 'Unknown',
        sku: sq.products?.sku || '',
        total_stock: 0,
      };
    }
    productMap[sq.product_id].total_stock += sq.quantity || 0;
  });

  const chartData = Object.values(productMap)
    .sort((a, b) => b.total_stock - a.total_stock)
    .slice(0, 10);

  return res.json({ success: true, data: chartData });
});

module.exports = { getKpis, getStockChart };
