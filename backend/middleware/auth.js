import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('=== Auth Debug ===');
  console.log('Auth header:', authHeader ? 'Present' : 'Missing');
  console.log('Token:', token ? token.substring(0, 20) + '...' : 'Missing');

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ Token verification failed:', err.message);
      console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
    console.log('✅ Token valid for user:', user.userId, 'role:', user.role);
    req.user = user;
    next();
  });
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    next();
  };
};
