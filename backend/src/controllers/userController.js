/**
 * userController.js - User Profile & Account Management Controller
 * Handles user profile retrieval and account deletion
 */

const User = require('../models/User');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const fs = require('fs');
const path = require('path');

// ─── GET /api/users/profile ────────────────────────────────────────────────────
/**
 * Return the authenticated user's profile along with usage statistics.
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Count the user's resumes and analyses
    const [resumeCount, analysisCount, analyses] = await Promise.all([
      Resume.countDocuments({ userId: req.user._id }),
      Analysis.countDocuments({ userId: req.user._id }),
      Analysis.find({ userId: req.user._id })
        .select('atsScore')
        .lean(),
    ]);

    // Calculate average ATS score across all analyses
    const avgAtsScore =
      analyses.length > 0
        ? Math.round(
            analyses.reduce((sum, a) => sum + (a.atsScore || 0), 0) / analyses.length
          )
        : 0;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        totalAnalyses: user.totalAnalyses,
        bookmarksCount: user.bookmarks.length,
        createdAt: user.createdAt,
      },
      stats: {
        resumeCount,
        analysisCount,
        avgAtsScore,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/users/account ─────────────────────────────────────────────────
/**
 * Permanently delete the user account along with all associated data.
 * This includes all resume files on disk, Resume documents, and Analysis documents.
 */
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all resumes to get file paths for disk cleanup
    const resumes = await Resume.find({ userId }).select('filename').lean();

    // Delete all physical resume files from the uploads directory
    const uploadDir = path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads');
    for (const resume of resumes) {
      const filePath = path.join(uploadDir, resume.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete all analyses belonging to this user
    await Analysis.deleteMany({ userId });

    // Delete all resume documents belonging to this user
    await Resume.deleteMany({ userId });

    // Finally, delete the user account itself
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  deleteAccount,
};
