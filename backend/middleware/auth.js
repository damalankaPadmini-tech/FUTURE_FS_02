const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_replace_me_in_production');
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token.' });
  }
}

module.exports = authenticateToken;
