/**
 * errorHandler.js - Global Express Error Handler Middleware
 * Catches all errors passed via next(err) and returns consistent JSON responses
 */

const multer = require('multer');

/**
 * Global error handler — must be registered LAST in the Express middleware chain.
 * Handles specific known error types and falls back to a generic 500 response.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
  // Always log the error for server-side debugging
  console.error('❌ Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Default error shape
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // ── Mongoose Validation Error ────────────────────────────────────────────────
  // e.g. required fields missing, enum violations, custom validators
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join('. ');
  }

  // ── Mongoose CastError (invalid ObjectId) ────────────────────────────────────
  // e.g. a malformed document ID passed in a route param
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field '${err.path}': ${err.value}`;
  }

  // ── Mongoose Duplicate Key Error ─────────────────────────────────────────────
  // e.g. email already registered (unique index violation)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    message = `Duplicate value: '${value}' is already in use for ${field}.`;
  }

  // ── JWT Errors ────────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
  }

  // ── Multer Errors ─────────────────────────────────────────────────────────────
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = `File too large. Maximum allowed size is ${
        (parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760) / 1048576
      } MB.`;
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected file field: '${err.field}'. Use the 'resume' field.`;
    } else {
      message = `File upload error: ${err.message}`;
    }
  }

  // ── Custom file filter error (from upload middleware) ─────────────────────────
  if (err.message && err.message.includes('Invalid file type')) {
    statusCode = 400;
    message = err.message;
  }

  // ── Build the response object ─────────────────────────────────────────────────
  const response = {
    success: false,
    message,
  };

  // Include the stack trace in development for easier debugging
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
