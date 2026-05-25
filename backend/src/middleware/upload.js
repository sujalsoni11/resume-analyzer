/**
 * upload.js - Multer File Upload Middleware
 *
 * Uses memoryStorage instead of diskStorage so it works on Vercel's
 * serverless environment (no writable filesystem). The file is available
 * as req.file.buffer (a Buffer) in the route handler.
 *
 * For local dev this also works perfectly — no temp files to clean up.
 */

const multer = require('multer');
const path = require('path');

// ─── Memory Storage ────────────────────────────────────────────────────────────
// Files are kept in RAM as Buffer objects. Since we only need to parse
// the PDF text and store it in MongoDB, we don't need to persist the file.
const storage = multer.memoryStorage();

// ─── File Type Filter ─────────────────────────────────────────────────────────
/**
 * Only allow PDF and DOCX files.
 * DOCX support is UI-only for now; PDF is the primary supported format.
 */
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const allowedExtensions = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error('Invalid file type. Only PDF and DOCX files are accepted.'),
      false
    );
  }
};

// ─── Multer Instance ──────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    // Default to 10 MB if MAX_FILE_SIZE env var is not set
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024,
  },
});

module.exports = upload;
