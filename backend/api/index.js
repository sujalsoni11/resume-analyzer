/**
 * api/index.js - Vercel Serverless Entry Point
 *
 * Vercel requires a single exported handler. We import the Express app
 * (which does NOT call app.listen()) and export it here so Vercel's
 * Node.js runtime can handle incoming requests.
 *
 * For local development, use server.js which calls app.listen().
 */

require('dotenv').config();
const app = require('../src/app');

// Export the Express app as the Vercel serverless handler
module.exports = app;
