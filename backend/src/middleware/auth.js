/**
 * auth.js - JWT Authentication Middleware
 * Validates Bearer tokens and attaches the authenticated user to req.user
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect - Express middleware that enforces JWT authentication.
 *
 * Expects: Authorization: Bearer <token>
 * On success: attaches the user document (without password) to req.user
 * On failure: returns an appropriate 401 error response
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // ── Extract token from Authorization header ──────────────────────────────
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // No token provided at all
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided. Please log in.',
      });
    }

    // ── Verify the token signature and expiry ────────────────────────────────
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please log in again.',
        });
      }
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please log in again.',
        });
      }
      // Any other JWT error
      return res.status(401).json({
        success: false,
        message: 'Token verification failed. Please log in again.',
      });
    }

    // ── Fetch the user from the database ─────────────────────────────────────
    // Exclude password field from the result
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // ── Attach user to request for downstream handlers ────────────────────────
    req.user = user;
    next();
  } catch (error) {
    // Unexpected server error during auth check
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
    });
  }
};

module.exports = { protect };
