const { supabaseAdmin } = require('../lib/supabaseAdmin');
const { asyncHandler } = require('../utils/asyncHandler');
const { createProductSchema, updateProductSchema } = require('../schemas/product.schema');

/**
 * GET /api/products
 * Returns all products with their category name and aggregated stock quantity.
 */
const listProducts = asyncHandler(async (req, res) => {
  const { search, category_id } = req.query;

  let query = supabaseAdmin
    .from('products')
    .select(`
      *,
      categories ( id, name ),
      stock_quantities ( quantity )
    `)
    .order('created_at', { ascending: false });

  if (category_id) {
    query = query.eq('category_id', category_id);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ success: false, error: error.message });

  // Aggregate total stock across all locations per product
  const products = data.map((p) => ({
    ...p,
    total_stock: (p.stock_quantities || []).reduce((sum, sq) => sum + (sq.quantity || 0), 0),
    stock_quantities: undefined, // remove raw join noise
  }));

  return res.json({ success: true, data: products });
});

/**
 * GET /api/products/:id
 * Single product with full stock detail per location.
 */
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      categories ( id, name ),
      stock_quantities (
        quantity,
        locations ( id, name, type, warehouse_id, warehouses ( name ) )
      )
    `)
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ success: false, error: 'Product not found' });

  return res.json({ success: true, data });
});

/**
 * POST /api/products
 */
const createProduct = asyncHandler(async (req, res) => {
  const body = createProductSchema.parse(req.body);

  // Check SKU uniqueness
  const { data: existing } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('sku', body.sku)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({ success: false, error: `SKU "${body.sku}" already exists` });
  }

  const { data, error } = await supabaseAdmin.from('products').insert(body).select().single();
  if (error) return res.status(400).json({ success: false, error: error.message });

  return res.status(201).json({ success: true, data });
});

/**
 * PUT /api/products/:id
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = updateProductSchema.parse(req.body);

  // If SKU is being changed, check uniqueness
  if (body.sku) {
    const { data: existing } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('sku', body.sku)
      .neq('id', id)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ success: false, error: `SKU "${body.sku}" already in use` });
    }
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });
  if (!data) return res.status(404).json({ success: false, error: 'Product not found' });

  return res.json({ success: true, data });
});

/**
 * DELETE /api/products/:id
 * Blocks deletion if the product has any stock_moves records.
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { count } = await supabaseAdmin
    .from('stock_moves')
    .select('id', { count: 'exact', head: true })
    .eq('product_id', id);

  if (count > 0) {
    return res.status(409).json({
      success: false,
      error: 'Cannot delete product: it has existing stock movement history',
    });
  }

  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) return res.status(400).json({ success: false, error: error.message });

  return res.json({ success: true, message: 'Product deleted' });
});

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
