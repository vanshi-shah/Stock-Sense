const { supabaseAdmin } = require('../lib/supabaseAdmin');
const { asyncHandler } = require('../utils/asyncHandler');
const { createSupplierSchema, updateSupplierSchema } = require('../schemas/supplier.schema');

/**
 * GET /api/suppliers
 */
const listSuppliers = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('suppliers')
    .select('*')
    .order('name', { ascending: true });

  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, data });
});

/**
 * GET /api/suppliers/:id
 */
const getSupplier = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabaseAdmin
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ success: false, error: 'Supplier not found' });
  return res.json({ success: true, data });
});

/**
 * POST /api/suppliers
 */
const createSupplier = asyncHandler(async (req, res) => {
  const body = createSupplierSchema.parse(req.body);
  const { data, error } = await supabaseAdmin.from('suppliers').insert(body).select().single();
  if (error) return res.status(400).json({ success: false, error: error.message });
  return res.status(201).json({ success: true, data });
});

/**
 * PUT /api/suppliers/:id
 */
const updateSupplier = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = updateSupplierSchema.parse(req.body);

  const { data, error } = await supabaseAdmin
    .from('suppliers')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });
  if (!data) return res.status(404).json({ success: false, error: 'Supplier not found' });
  return res.json({ success: true, data });
});

/**
 * DELETE /api/suppliers/:id
 */
const deleteSupplier = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error } = await supabaseAdmin.from('suppliers').delete().eq('id', id);
  if (error) return res.status(400).json({ success: false, error: error.message });
  return res.json({ success: true, message: 'Supplier deleted' });
});

module.exports = { listSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier };
