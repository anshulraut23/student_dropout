import jwt from 'jsonwebtoken';
import dataStore from '../storage/dataStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-local-jwt-secret';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('=== Auth Debug ===');
  console.log('Auth header:', authHeader ? 'Present' : 'Missing');
  console.log('Token:', token ? token.substring(0, 20) + '...' : 'Missing');

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token valid for user:', user.userId, 'role:', user.role);

    if (['admin', 'teacher'].includes(user.role) && user.schoolId) {
      const school = await dataStore.getSchoolById(user.schoolId);
      const isSchoolActive = school ? (school.isActive ?? school.is_active ?? true) : true;

      if (!isSchoolActive) {
        return res.status(403).json({
          success: false,
          error: 'Your school is currently deactivated. Contact the super admin.'
        });
      }
    }

    req.user = user;
    next();
  } catch (err) {
    console.log('❌ Token verification failed:', err.message);
    console.log('JWT secret configured:', !!process.env.JWT_SECRET);
    return res.status(403).json({ success: false, error: 'Invalid or expired token' });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    next();
  };
};
