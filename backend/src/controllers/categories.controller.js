const { supabaseAdmin } = require('../lib/supabaseAdmin');
const { asyncHandler } = require('../utils/asyncHandler');
const { createCategorySchema, updateCategorySchema } = require('../schemas/category.schema');

/**
 * GET /api/categories
 */
const listCategories = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, data });
});

/**
 * GET /api/categories/:id
 */
const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ success: false, error: 'Category not found' });
  return res.json({ success: true, data });
});

/**
 * POST /api/categories
 */
const createCategory = asyncHandler(async (req, res) => {
  const body = createCategorySchema.parse(req.body);
  const { data, error } = await supabaseAdmin.from('categories').insert(body).select().single();
  if (error) return res.status(400).json({ success: false, error: error.message });
  return res.status(201).json({ success: true, data });
});

/**
 * PUT /api/categories/:id
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = updateCategorySchema.parse(req.body);

  const { data, error } = await supabaseAdmin
    .from('categories')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });
  if (!data) return res.status(404).json({ success: false, error: 'Category not found' });
  return res.json({ success: true, data });
});

/**
 * DELETE /api/categories/:id
 * Blocked if any products reference this category.
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { count } = await supabaseAdmin
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id);

  if (count > 0) {
    return res.status(409).json({
      success: false,
      error: 'Cannot delete category: products are assigned to it',
    });
  }

  const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
  if (error) return res.status(400).json({ success: false, error: error.message });
  return res.json({ success: true, message: 'Category deleted' });
});

module.exports = { listCategories, getCategory, createCategory, updateCategory, deleteCategory };
