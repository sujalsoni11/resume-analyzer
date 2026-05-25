/**
 * pdfService.js - PDF Text Extraction Service
 *
 * Accepts a Buffer (from Multer memoryStorage) directly — no file path needed.
 * This works identically on Vercel serverless and local development.
 */

const pdfParse = require('pdf-parse');

/**
 * Extract text content from a PDF buffer.
 *
 * @param {Buffer} buffer - PDF file contents as a Buffer (from req.file.buffer)
 * @returns {Promise<{ text: string, wordCount: number, pages: number }>}
 */
const extractTextFromPDF = async (buffer) => {
  // pdf-parse accepts a Buffer directly — no disk read needed
  const data = await pdfParse(buffer);

  // Trim whitespace from the raw extracted text
  const text = data.text.trim();

  // Count words by splitting on whitespace and filtering empty tokens
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;

  return {
    text,
    wordCount,
    pages: data.numpages,
  };
};

module.exports = { extractTextFromPDF };
