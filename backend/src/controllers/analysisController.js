/**
 * analysisController.js - AI Analysis Controller
 * Handles creation and retrieval of AI-generated resume analyses,
 * bookmarks, dashboard statistics, and report downloads.
 */

const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { generateFullAnalysis } = require('../services/aiService');
const { getOverallRating } = require('../utils/helpers');

// ─── POST /api/analysis ────────────────────────────────────────────────────────
/**
 * Create a new AI analysis for a given resume and job role.
 * This is the primary endpoint — calls Gemini and saves the result.
 */
const createAnalysis = async (req, res, next) => {
  try {
    const { resumeId, jobRole } = req.body;

    // Validate required fields
    if (!resumeId || !jobRole) {
      return res.status(400).json({
        success: false,
        message: 'Both resumeId and jobRole are required.',
      });
    }

    if (jobRole.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Job role must be at least 2 characters long.',
      });
    }

    // Fetch the resume and verify ownership
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This resume does not belong to you.',
      });
    }

    // Ensure the resume has extractable text for analysis
    if (!resume.parsedText || resume.parsedText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message:
          'This resume has no extractable text. Please upload a text-based PDF (not a scanned image).',
      });
    }

    // ── Call Gemini AI ────────────────────────────────────────────────────────
    const aiResult = await generateFullAnalysis(resume.parsedText, jobRole.trim());

    // Derive overallRating from atsScore (AI might provide one but we enforce our logic)
    const overallRating = getOverallRating(aiResult.atsScore || 0);

    // ── Save Analysis to Database ─────────────────────────────────────────────
    const analysis = await Analysis.create({
      userId: req.user._id,
      resumeId: resume._id,
      jobRole: jobRole.trim(),
      atsScore: aiResult.atsScore,
      overallRating,
      summary: aiResult.summary,
      skills: aiResult.skills,
      sections: aiResult.sections,
      suggestions: aiResult.suggestions,
      keywords: aiResult.keywords,
      interviewQuestions: aiResult.interviewQuestions,
      coverLetter: aiResult.coverLetter,
      careerRoadmap: aiResult.careerRoadmap,
      jobMatch: aiResult.jobMatch,
      grammarScore: aiResult.grammarScore,
    });

    // Increment the user's total analysis count
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalAnalyses: 1 } });

    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully.',
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/analysis ─────────────────────────────────────────────────────────
/**
 * Get all analyses for the authenticated user, paginated, sorted by newest first.
 */
const getAnalyses = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [analyses, total] = await Promise.all([
      Analysis.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('resumeId', 'originalName filename uploadedAt')
        .lean(),
      Analysis.countDocuments({ userId: req.user._id }),
    ]);

    res.status(200).json({
      success: true,
      analyses,
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

// ─── GET /api/analysis/dashboard ──────────────────────────────────────────────
/**
 * Return aggregated dashboard statistics for the authenticated user.
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Run all queries in parallel for efficiency
    const [totalResumes, totalAnalyses, allAnalyses, recentAnalyses] =
      await Promise.all([
        // Import Resume model inline to avoid circular dependency issues
        require('../models/Resume').countDocuments({ userId }),
        Analysis.countDocuments({ userId }),
        Analysis.find({ userId })
          .select('atsScore createdAt')
          .sort({ createdAt: -1 })
          .lean(),
        Analysis.find({ userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('resumeId', 'originalName')
          .select('jobRole atsScore overallRating createdAt resumeId')
          .lean(),
      ]);

    // Calculate average ATS score
    const avgAtsScore =
      allAnalyses.length > 0
        ? Math.round(
            allAnalyses.reduce((sum, a) => sum + (a.atsScore || 0), 0) /
              allAnalyses.length
          )
        : 0;

    // Find the best (highest) ATS score ever achieved
    const bestAtsScore =
      allAnalyses.length > 0
        ? Math.max(...allAnalyses.map((a) => a.atsScore || 0))
        : 0;

    // ATS score history for chart — last 10 analyses with date and score
    const atsScoreHistory = allAnalyses.slice(0, 10).map((a) => ({
      date: a.createdAt,
      atsScore: a.atsScore || 0,
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalResumes,
        totalAnalyses,
        avgAtsScore,
        bestAtsScore,
        recentAnalyses,
        atsScoreHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/analysis/bookmarks ──────────────────────────────────────────────
/**
 * Get all bookmarked analyses for the authenticated user.
 */
const getBookmarks = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({
      userId: req.user._id,
      bookmarked: true,
    })
      .sort({ createdAt: -1 })
      .populate('resumeId', 'originalName filename')
      .lean();

    res.status(200).json({
      success: true,
      bookmarks: analyses,
      total: analyses.length,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/analysis/:id ─────────────────────────────────────────────────────
/**
 * Get a single analysis by ID with full details.
 * Validates ownership before returning.
 */
const getAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id).populate(
      'resumeId',
      'originalName filename fileSize wordCount uploadedAt'
    );

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found.',
      });
    }

    // Ensure this analysis belongs to the requesting user
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This analysis does not belong to you.',
      });
    }

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/analysis/:id/bookmark ─────────────────────────────────────────
/**
 * Toggle the bookmark status of an analysis.
 * Also updates the user's bookmarks array accordingly.
 */
const toggleBookmark = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found.',
      });
    }

    // Verify ownership
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This analysis does not belong to you.',
      });
    }

    // Toggle the bookmark flag
    analysis.bookmarked = !analysis.bookmarked;
    await analysis.save();

    // Sync the user's bookmarks array
    if (analysis.bookmarked) {
      // Add to bookmarks if not already there
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { bookmarks: analysis._id },
      });
    } else {
      // Remove from bookmarks
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { bookmarks: analysis._id },
      });
    }

    res.status(200).json({
      success: true,
      message: analysis.bookmarked
        ? 'Analysis bookmarked successfully.'
        : 'Bookmark removed successfully.',
      bookmarked: analysis.bookmarked,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/analysis/:id/download ───────────────────────────────────────────
/**
 * Download a full analysis report as JSON.
 * Increments the download count and returns the complete analysis data.
 * The frontend can use this data to generate a PDF report.
 */
const downloadReport = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id)
      .populate('resumeId', 'originalName filename wordCount uploadedAt')
      .lean();

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found.',
      });
    }

    // Verify ownership
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This analysis does not belong to you.',
      });
    }

    // Increment the download count
    await Analysis.findByIdAndUpdate(req.params.id, {
      $inc: { downloadCount: 1 },
    });

    // Build a clean filename for the download
    const jobRoleSlug = analysis.jobRole.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const dateStr = new Date(analysis.createdAt).toISOString().split('T')[0];
    const downloadFilename = `resume_analysis_${jobRoleSlug}_${dateStr}.json`;

    // Set headers so the browser treats this as a file download
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    res.setHeader('Content-Type', 'application/json');

    res.status(200).json({
      success: true,
      reportGeneratedAt: new Date().toISOString(),
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAnalysis,
  getAnalyses,
  getAnalysis,
  toggleBookmark,
  getBookmarks,
  getDashboardStats,
  downloadReport,
};
