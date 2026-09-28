const jwt = require('jsonwebtoken');
const { memoryStore } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT token middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Find user in memoryStore (or DB)
    const user = memoryStore.users.find(u => u.id === decoded.id || u._id?.toString() === decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User account no longer exists or session expired.' });
    }
    if (user.status === 'deactivated') {
      return res.status(403).json({ message: 'Account is deactivated. Please contact administrator.' });
    }

    req.user = {
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Action requires one of the following roles: ${roles.join(', ')}.` 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize, JWT_SECRET };
