const { supabaseAdmin } = require('../lib/supabaseAdmin');
const { asyncHandler } = require('../utils/asyncHandler');
const { createOperationSchema, updateOperationSchema } = require('../schemas/operation.schema');
const { validateOperation, cancelOperation } = require('../services/stock.service');

/**
 * GET /api/operations
 * Supports filters: type, status, warehouse_id (future), search
 */
const listOperations = asyncHandler(async (req, res) => {
  const { type, status, search } = req.query;

  let query = supabaseAdmin
    .from('operations')
    .select(`
      *,
      users ( id, email )
    `)
    .order('created_at', { ascending: false });

  if (type) query = query.eq('type', type);
  if (status) query = query.eq('status', status);
  if (search) query = query.ilike('reference_document', `%${search}%`);

  const { data, error } = await query;
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, data });
});

/**
 * GET /api/operations/:id
 * Single operation with its stock_move lines.
 */
const getOperation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from('operations')
    .select(`
      *,
      users ( id, email ),
      stock_moves (
        id,
        quantity,
        timestamp,
        products ( id, name, sku ),
        from_location:from_location_id ( id, name, warehouses(name) ),
        to_location:to_location_id ( id, name, warehouses(name) )
      )
    `)
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ success: false, error: 'Operation not found' });
  return res.json({ success: true, data });
});

/**
 * POST /api/operations
 * Creates an operation in 'draft' status with its move lines stored temporarily.
 * Lines are stored as metadata in a pending_lines column approach — however since
 * stock_moves are only inserted on validate, we store lines in the operation's
 * reference_document or return them to the client to resubmit on validate.
 *
 * Architecture decision: lines are stored client-side until validate is called.
 * The create endpoint just creates the operation header.
 */
const createOperation = asyncHandler(async (req, res) => {
  const body = createOperationSchema.parse(req.body);
  let userId = req.user?.id || null;

  if (userId) {
    const { data: userExists } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (!userExists) {
      const { error: userInsertErr } = await supabaseAdmin.from('users').upsert({
        id: userId,
        email: req.user?.email || 'user@stocksense.dev',
        role: 'user',
      });
      if (userInsertErr) {
        // If upsert fails, set created_by to null so FK constraint doesn't throw
        userId = null;
      }
    }
  }

  const { data, error } = await supabaseAdmin
    .from('operations')
    .insert({
      type: body.type,
      status: 'draft',
      reference_document: body.reference_document || null,
      created_by: userId,
    })
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });

  // Return created operation + the lines for the client to hold
  return res.status(201).json({ success: true, data: { ...data, lines: body.lines } });
});

/**
 * PUT /api/operations/:id
 * Update draft operation metadata (not allowed if done/canceled).
 */
const updateOperation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch current state
  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from('operations')
    .select('status')
    .eq('id', id)
    .single();

  if (fetchErr || !existing) {
    return res.status(404).json({ success: false, error: 'Operation not found' });
  }

  if (existing.status === 'done' || existing.status === 'canceled') {
    return res.status(409).json({
      success: false,
      error: `Cannot update a ${existing.status} operation`,
    });
  }

  const body = updateOperationSchema.parse(req.body);

  const updatePayload = {};
  if (body.reference_document !== undefined) updatePayload.reference_document = body.reference_document;

  const { data, error } = await supabaseAdmin
    .from('operations')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });

  return res.json({ success: true, data: { ...data, lines: body.lines } });
});

/**
 * POST /api/operations/:id/validate
 * Executes stock moves and marks operation as done.
 * Body: { lines: [{ product_id, from_location_id, to_location_id, quantity }] }
 */
const validateOp = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: op, error: fetchErr } = await supabaseAdmin
    .from('operations')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchErr || !op) {
    return res.status(404).json({ success: false, error: 'Operation not found' });
  }

  if (op.status === 'done') {
    return res.status(409).json({ success: false, error: 'Operation is already completed' });
  }
  if (op.status === 'canceled') {
    return res.status(409).json({ success: false, error: 'Cannot validate a canceled operation' });
  }

  // Lines must be supplied in the validate request
  const { lines } = req.body;
  if (!lines || !Array.isArray(lines) || lines.length === 0) {
    return res.status(400).json({ success: false, error: 'lines[] are required for validation' });
  }

  // Run the stock service — throws on insufficient stock or invalid state
  await validateOperation(id, op.type, lines);

  return res.json({ success: true, message: `Operation ${id} validated and marked as done` });
});

/**
 * POST /api/operations/:id/cancel
 */
const cancelOp = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: op, error: fetchErr } = await supabaseAdmin
    .from('operations')
    .select('status')
    .eq('id', id)
    .single();

  if (fetchErr || !op) {
    return res.status(404).json({ success: false, error: 'Operation not found' });
  }

  await cancelOperation(id, op.status);

  return res.json({ success: true, message: `Operation ${id} canceled` });
});

module.exports = {
  listOperations,
  getOperation,
  createOperation,
  updateOperation,
  validateOp,
  cancelOp,
};
