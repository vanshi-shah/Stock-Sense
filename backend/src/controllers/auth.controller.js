const { supabase } = require("../lib/supabase");
const { registerSchema, loginSchema } = require("../schemas/auth.schema");

/**
 * POST /api/auth/register
 * Proxy to Supabase Auth signUp (server-side).
 */
async function register(req, res) {
  const data = registerSchema.parse(req.body);

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json({
    user: authData.user,
    session: authData.session,
  });
}

/**
 * POST /api/auth/login
 * Proxy to Supabase Auth signInWithPassword (server-side).
 */
async function login(req, res) {
  const data = loginSchema.parse(req.body);

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  return res.json({
    user: authData.user,
    session: authData.session,
    token: authData.session?.access_token,
  });
}

/**
 * POST /api/auth/reset-password
 * Sends a password reset OTP email via Supabase.
 */
async function resetPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.CLIENT_URL}/update-password`,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json({ message: "Password reset OTP sent to email" });
}

module.exports = { register, login, resetPassword };
