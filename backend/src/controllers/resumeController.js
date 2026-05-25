/**
 * resumeController.js - Resume Upload & Management Controller
 * Handles file upload, text extraction, and CRUD operations for resumes.
 *
 * Uses Multer memoryStorage — files are available as req.file.buffer.
 * No files are written to disk, making this fully compatible with Vercel serverless.
 */

const path = require('path');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const { extractTextFromPDF } = require('../services/pdfService');
const { formatFileSize } = require('../utils/helpers');

// ─── POST /api/resumes ─────────────────────────────────────────────────────────
/**
 * Upload a new resume file.
 * Extracts text from the PDF, saves resume metadata to the database.
 */
const uploadResume = async (req, res, next) => {
  try {
    // Multer (memoryStorage) places file info in req.file; buffer in req.file.buffer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please attach a PDF resume file.',
      });
    }

    const { originalname, size, buffer } = req.file;

    // Extract text content directly from the in-memory buffer
    let parsedText = '';
    let wordCount = 0;

    if (path.extname(originalname).toLowerCase() === '.pdf') {
      try {
        const extracted = await extractTextFromPDF(buffer);
        parsedText = extracted.text;
        wordCount = extracted.wordCount;
      } catch (parseError) {
        // If PDF parsing fails, still save the resume but with empty parsedText
        console.error('PDF parse error:', parseError.message);
      }
    }

    // Warn if no text could be extracted (e.g. scanned image PDF)
    if (!parsedText) {
      console.warn(`Warning: No text extracted from resume: ${originalname}`);
    }

    // Save resume metadata + extracted text to database
    // Note: We do NOT store the raw file — just the parsed text in MongoDB.
    const resume = await Resume.create({
      userId: req.user._id,
      filename: originalname, // Use originalname as identifier (no disk path)
      originalName: originalname,
      fileSize: size,
      parsedText,
      wordCount,
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and processed successfully.',
      resume: {
        id: resume._id,
        originalName: resume.originalName,
        fileSize: formatFileSize(resume.fileSize),
        wordCount: resume.wordCount,
        hasText: parsedText.length > 0,
        uploadedAt: resume.uploadedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/resumes ──────────────────────────────────────────────────────────
/**
 * Get all resumes belonging to the authenticated user with pagination.
 */
const getResumes = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [resumes, total] = await Promise.all([
      Resume.find({ userId: req.user._id })
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-parsedText') // Don't send full text in list view — too large
        .lean(),
      Resume.countDocuments({ userId: req.user._id }),
    ]);

    // Format file sizes for display
    const formattedResumes = resumes.map((r) => ({
      ...r,
      fileSize: formatFileSize(r.fileSize || 0),
    }));

    res.status(200).json({
      success: true,
      resumes: formattedResumes,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/resumes/:id ──────────────────────────────────────────────────────
/**
 * Get a single resume by ID. Must belong to the authenticated user.
 */
const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    // Ensure ownership — users can only view their own resumes
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This resume does not belong to you.',
      });
    }

    res.status(200).json({
      success: true,
      resume: {
        ...resume.toObject(),
        fileSize: formatFileSize(resume.fileSize || 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/resumes/:id ───────────────────────────────────────────────────
/**
 * Delete a resume by ID.
 * Removes the database document, the physical file, and all linked analyses.
 */
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    // Ensure ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This resume does not belong to you.',
      });
    }

    // Since we use memoryStorage (no disk persistence), there is no physical
    // file to delete — only the DB records need to be cleaned up.

    // Cascade: delete all analyses linked to this resume
    await Analysis.deleteMany({ resumeId: resume._id });

    // Delete the resume document itself
    await Resume.findByIdAndDelete(resume._id);

    res.status(200).json({
      success: true,
      message: 'Resume and all associated analyses have been deleted.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  getResumes,
  getResume,
  deleteResume,
};
