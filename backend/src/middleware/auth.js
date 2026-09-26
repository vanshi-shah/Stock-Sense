const { supabaseAdmin } = require('../lib/supabaseAdmin');

/**
 * requireAuth — validates a Supabase JWT access token.
 *
 * Extracts the Bearer token from the Authorization header and verifies it
 * against Supabase Auth. Attaches the full user object to req.user.
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Token expired or invalid' });
    }
    // Attach full Supabase user to request
    req.user = data.user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Token expired or invalid' });
  }
}

function requireRole(role) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized: No user found' });
    }
    const userRole = req.user.user_metadata?.role || req.user.role;
    if (userRole !== role) {
      return res.status(403).json({ success: false, error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
