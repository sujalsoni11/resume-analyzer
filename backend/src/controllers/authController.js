/**
 * authController.js - Authentication Controller
 * Handles user registration, login, profile retrieval, and password management
 */

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// ─── Helper: Generate JWT Token ────────────────────────────────────────────────
/**
 * Sign a JWT token for the given user ID.
 * @param {string} userId - MongoDB ObjectId as string
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── POST /api/auth/register ───────────────────────────────────────────────────
/**
 * Register a new user account.
 * Validates input, checks for existing email, creates user, returns JWT.
 */
const register = async (req, res, next) => {
  try {
    // Check express-validator results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { name, email, password } = req.body;

    // Check if email is already registered
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in.',
      });
    }

    // Create the new user (password hashing handled by pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate authentication token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        totalAnalyses: user.totalAnalyses,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
/**
 * Authenticate an existing user and return a JWT token.
 */
const login = async (req, res, next) => {
  try {
    // Check express-validator results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { email, password } = req.body;

    // Find user — explicitly select password since it's excluded by default
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare the submitted password with the stored hash
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate authentication token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        totalAnalyses: user.totalAnalyses,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/auth/me ──────────────────────────────────────────────────────────
/**
 * Return the currently authenticated user's profile.
 * req.user is attached by the auth middleware.
 */
const getMe = async (req, res, next) => {
  try {
    // Fetch fresh user data with bookmark count
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        totalAnalyses: user.totalAnalyses,
        avatar: user.avatar,
        bookmarksCount: user.bookmarks.length,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/auth/profile ─────────────────────────────────────────────────────
/**
 * Update the authenticated user's name and/or avatar.
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    // Build update object — only include fields that were provided
    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (avatar !== undefined) updateFields.avatar = avatar.trim();

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields provided to update. Send name or avatar.',
      });
    }

    // Validate name length if provided
    if (updateFields.name && updateFields.name.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot exceed 100 characters.',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/auth/change-password ────────────────────────────────────────────
/**
 * Change the authenticated user's password after verifying the old one.
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Both fields are required
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both currentPassword and newPassword are required.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    // Fetch user WITH password for comparison
    const user = await User.findById(req.user._id).select('+password');

    // Verify the current password is correct
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    // Prevent using the same password
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from the current password.',
      });
    }

    // Set new password — the pre-save hook will hash it automatically
    user.password = newPassword;
    await user.save();

    // Issue a fresh token after password change for seamless UX
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
};
