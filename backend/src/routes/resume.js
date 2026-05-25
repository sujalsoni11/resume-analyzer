/**
 * resume.js - Resume Routes
 * POST   /api/resumes/       (protected) — upload a resume file
 * GET    /api/resumes/       (protected) — list all resumes for user
 * GET    /api/resumes/:id    (protected) — get single resume
 * DELETE /api/resumes/:id    (protected) — delete a resume
 */

const express = require('express');
const router = express.Router();

const {
  uploadResume,
  getResumes,
  getResume,
  deleteResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All resume routes require authentication
router.use(protect);

// Upload a new resume (multipart/form-data with 'resume' field)
router.post('/', upload.single('resume'), uploadResume);

// List all resumes for the authenticated user
router.get('/', getResumes);

// Get a single resume by ID
router.get('/:id', getResume);

// Delete a resume and all its associated analyses
router.delete('/:id', deleteResume);

module.exports = router;
