/**
 * server.js - Local Development Server
 *
 * This file is used for LOCAL development only (npm run dev / npm start locally).
 * On Vercel, the entry point is api/index.js which just exports the app.
 *
 * Usage:
 *   npm run dev   → nodemon server.js
 *   npm start     → node server.js  (local production test)
 */

require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB eagerly before starting the server
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📄 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
