/**
 * user.js - User Account Routes
 * GET    /api/users/profile  (protected) — get user profile with stats
 * DELETE /api/users/account  (protected) — permanently delete account
 */

const express = require('express');
const router = express.Router();

const { getProfile, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All user routes require authentication
router.use(protect);

// Get authenticated user's profile with statistics
router.get('/profile', getProfile);

// Permanently delete the authenticated user's account and all data
router.delete('/account', deleteAccount);

module.exports = router;
