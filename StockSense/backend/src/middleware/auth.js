const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = payload;
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
    
    // Check if the user has the required role
    if (req.user.role !== role) {
      return res.status(403).json({ success: false, error: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  };
}

module.exports = { requireAuth, requireRole };
