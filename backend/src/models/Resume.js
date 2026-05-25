/**
 * Resume.js - Resume Mongoose Model
 * Stores metadata and extracted text content for uploaded resume files
 */

const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  // Owner reference — which user uploaded this resume
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },

  // The filename stored on disk (uuid-based, safe for filesystem)
  filename: {
    type: String,
    required: [true, 'Filename is required'],
  },

  // The original filename as uploaded by the user (for display purposes)
  originalName: {
    type: String,
    required: [true, 'Original filename is required'],
  },

  // File size in bytes
  fileSize: {
    type: Number,
  },

  // Raw text extracted from the PDF for AI analysis
  parsedText: {
    type: String,
  },

  // Number of words in the parsed text
  wordCount: {
    type: Number,
  },

  // Resume version number — incremented when user re-uploads
  version: {
    type: Number,
    default: 1,
  },

  // Timestamp of when the resume was uploaded
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// ─── Indexes ───────────────────────────────────────────────────────────────────
// Frequently queried by userId to list all resumes for a user
resumeSchema.index({ userId: 1 });

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
