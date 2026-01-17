const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Token blacklist (in production, use Redis)
const tokenBlacklist = new Set();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Check if token is blacklisted (logged out)
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

    // Attach user ID to request
    req.userId = decoded.userId;
    req.token = token;

    // Optionally attach full user object
    if (req.includeUser) {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = user;
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token', code: 'INVALID_TOKEN' });
    }
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

// Optional middleware - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token || tokenBlacklist.has(token)) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.userId = decoded.userId;
    req.token = token;

    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};

// Middleware to include full user object
const includeUser = (req, res, next) => {
  req.includeUser = true;
  next();
};

// Add token to blacklist
const blacklistToken = (token) => {
  tokenBlacklist.add(token);

  // Clean up blacklist after token expiration (7 days)
  setTimeout(() => {
    tokenBlacklist.delete(token);
  }, 7 * 24 * 60 * 60 * 1000);
};

// Check if token is blacklisted
const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

module.exports = {
  authenticateToken,
  optionalAuth,
  includeUser,
  blacklistToken,
  isTokenBlacklisted
};
