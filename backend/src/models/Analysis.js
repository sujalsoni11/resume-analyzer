/**
 * Analysis.js - Analysis Mongoose Model
 * Stores full AI-generated resume analysis results
 */

const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  // Reference to the user who requested the analysis
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },

  // Reference to the resume that was analyzed
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: [true, 'Resume ID is required'],
  },

  // The target job role provided by the user (e.g. "Senior Frontend Developer")
  jobRole: {
    type: String,
    required: [true, 'Job role is required'],
  },

  // ATS compatibility score out of 100
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
  },

  // Overall qualitative rating derived from atsScore
  overallRating: {
    type: String,
    enum: ['Poor', 'Fair', 'Good', 'Excellent'],
  },

  // Short AI-generated summary of the resume (3 sentences)
  summary: {
    type: String,
  },

  // Skills analysis: found in resume, missing vs job role, and recommended additions
  skills: {
    found: [String],
    missing: [String],
    recommended: [String],
  },

  // Per-section scores and feedback
  sections: {
    experience: {
      score: Number,
      feedback: String,
    },
    education: {
      score: Number,
      feedback: String,
    },
    projects: {
      score: Number,
      feedback: String,
    },
    summary: {
      score: Number,
      feedback: String,
    },
    formatting: {
      score: Number,
      feedback: String,
    },
  },

  // Actionable improvement suggestions ordered by priority
  suggestions: [
    {
      section: String,    // Which section this applies to
      issue: String,      // What the problem is
      improvement: String,// Specific recommended improvement
      priority: String,   // High / Medium / Low
    },
  ],

  // ATS keyword analysis
  keywords: {
    present: [String],  // Keywords already in the resume
    missing: [String],  // Important keywords absent from resume
  },

  // AI-generated likely interview questions for this role
  interviewQuestions: [
    {
      question: String,
      category: String,    // Technical / Behavioral / Situational
      difficulty: String,  // Easy / Medium / Hard
    },
  ],

  // AI-generated cover letter tailored to the job role
  coverLetter: {
    type: String,
  },

  // Month-by-month career improvement roadmap
  careerRoadmap: [
    {
      month: String,      // e.g. "Month 1-2"
      goal: String,       // Primary goal for this period
      actions: [String],  // Concrete action steps
    },
  ],

  // Job role match score and reasoning
  jobMatch: {
    score: Number,
    reasoning: String,
  },

  // Grammar and writing quality score out of 100
  grammarScore: {
    type: Number,
  },

  // AI-suggested companies the candidate could realistically target
  companySuggestions: [
    {
      name: String,       // Company name e.g. "Google"
      domain: String,     // Domain for Clearbit logo e.g. "google.com"
      matchScore: Number, // 0-100, how well the candidate fits this company
      reason: String,     // Why this company is a good fit
      roles: [String],    // Specific roles to apply for
      applyUrl: String,   // Direct URL to careers/jobs page
      tier: String,       // "Top Tier" | "Mid Tier" | "Startup"
    },
  ],

  // Whether the user has bookmarked this analysis
  bookmarked: {
    type: Boolean,
    default: false,
  },

  // How many times the user has downloaded this report
  downloadCount: {
    type: Number,
    default: 0,
  },

  // When the analysis was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ─── Indexes ───────────────────────────────────────────────────────────────────
// Support fast lookup by user and sorting by date
analysisSchema.index({ userId: 1 });
analysisSchema.index({ createdAt: -1 });

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;
