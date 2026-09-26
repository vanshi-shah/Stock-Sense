const { supabase } = require("../lib/supabase");
const { supabaseAdmin } = require("../lib/supabaseAdmin");
const { registerSchema, loginSchema } = require("../schemas/auth.schema");
const { asyncHandler } = require("../utils/asyncHandler");

/**
 * POST /api/auth/register
 * Proxy to Supabase Auth signUp (server-side).
 */
const register = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  if (authData.user) {
    try {
      await supabaseAdmin.from('users').upsert({
        id: authData.user.id,
        email: authData.user.email,
        role: 'user',
      });
    } catch (_) {}
  }

  return res.status(201).json({
    success: true,
    user: authData.user,
    session: authData.session,
  });
});

/**
 * POST /api/auth/login
 * Proxy to Supabase Auth signInWithPassword (server-side).
 */
const login = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return res.status(401).json({ success: false, error: error.message });
  }

  if (authData.user) {
    try {
      await supabaseAdmin.from('users').upsert({
        id: authData.user.id,
        email: authData.user.email,
        role: 'user',
      });
    } catch (_) {}
  }

  return res.json({
    success: true,
    user: authData.user,
    session: authData.session,
    token: authData.session?.access_token,
  });
});

/**
 * POST /api/auth/reset-password
 * Sends a password reset OTP email via Supabase.
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: "Email is required" });

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.CLIENT_URL}/update-password`,
  });

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  return res.json({ success: true, message: "Password reset OTP sent to email" });
});

module.exports = { register, login, resetPassword };
