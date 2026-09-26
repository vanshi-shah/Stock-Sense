const { supabaseAdmin } = require('../lib/supabaseAdmin');
const { asyncHandler } = require('../utils/asyncHandler');
const { z } = require('zod');

const roleSchema = z.object({
  role: z.enum(['admin', 'manager', 'staff', 'user']),
});

/**
 * GET /api/users
 * List all users.
 */
const listUsers = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, email, role');

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  return res.json({ success: true, data });
});

/**
 * PUT /api/users/:id/role
 * Update user role.
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = roleSchema.parse(req.body);

  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ role })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  return res.json({ success: true, data });
});

module.exports = {
  listUsers,
  updateUserRole,
};
