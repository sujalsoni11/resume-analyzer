/**
 * helpers.js - Utility/Helper Functions
 * Shared utilities used across the application
 */

/**
 * Calculate an overall rating label based on ATS score number.
 * @param {number} score - ATS score between 0 and 100
 * @returns {'Excellent'|'Good'|'Fair'|'Poor'}
 */
const getOverallRating = (score) => {
  if (score >= 81) return 'Excellent';
  if (score >= 61) return 'Good';
  if (score >= 41) return 'Fair';
  return 'Poor';
};

/**
 * Sanitize a filename by replacing any characters that are not
 * alphanumeric, dots, or hyphens with underscores.
 * @param {string} filename
 * @returns {string} sanitized filename
 */
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

/**
 * Convert a raw byte count into a human-readable file size string.
 * @param {number} bytes - file size in bytes
 * @returns {string} e.g. "1.4 MB", "512 KB", "800 B"
 */
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

module.exports = { getOverallRating, sanitizeFilename, formatFileSize };
