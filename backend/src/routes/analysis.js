/**
 * analysis.js - Analysis Routes
 * POST   /api/analysis/              (protected) — create new analysis
 * GET    /api/analysis/              (protected) — list all analyses
 * GET    /api/analysis/dashboard     (protected) — dashboard statistics
 * GET    /api/analysis/bookmarks     (protected) — get bookmarked analyses
 * GET    /api/analysis/:id           (protected) — get single analysis
 * PATCH  /api/analysis/:id/bookmark  (protected) — toggle bookmark
 * GET    /api/analysis/:id/download  (protected) — download report
 *
 * NOTE: Static routes (/dashboard, /bookmarks) MUST be defined BEFORE
 * parameterized routes (/:id) to prevent Express from treating 'dashboard'
 * and 'bookmarks' as ObjectId values.
 */

const express = require('express');
const router = express.Router();

const {
  createAnalysis,
  getAnalyses,
  getAnalysis,
  toggleBookmark,
  getBookmarks,
  getDashboardStats,
  downloadReport,
  deleteAnalysis,
} = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');

// All analysis routes require authentication
router.use(protect);

// ── Static routes first ────────────────────────────────────────────────────────
router.get('/dashboard', getDashboardStats);
router.get('/bookmarks', getBookmarks);

// ── Collection routes ──────────────────────────────────────────────────────────
router.post('/', createAnalysis);
router.get('/', getAnalyses);

// ── Parameterized routes ───────────────────────────────────────────────────────
router.get('/:id', getAnalysis);
router.patch('/:id/bookmark', toggleBookmark);
router.get('/:id/download', downloadReport);
router.delete('/:id', deleteAnalysis);

module.exports = router;
