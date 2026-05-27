/**
 * aiService.js - Google Gemini AI Integration Service
 * Generates comprehensive resume analysis using the Gemini 1.5 Flash model
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// ─── Initialize Gemini Client ──────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use Gemini 2.5 Flash for fast, cost-effective analysis
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// ─── Helper: Call Gemini API ───────────────────────────────────────────────────
/**
 * Send a prompt to the Gemini model and return the raw text response.
 * @param {string} prompt - The full prompt text to send
 * @returns {Promise<string>} Raw text response from Gemini
 */
const callGemini = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API call failed:', error.message);
    throw new Error(`AI service error: ${error.message}`);
  }
};

// ─── Helper: Parse JSON from Gemini Response ───────────────────────────────────
/**
 * Strip markdown code fences from a Gemini response and parse as JSON.
 * Gemini sometimes wraps JSON in ```json ... ``` blocks even when asked not to.
 * @param {string} text - Raw text from Gemini
 * @returns {Object} Parsed JSON object
 */
const parseJSON = (text) => {
  try {
    // Remove ```json and ``` fences if present
    let cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error('JSON parse error. Raw response:', text.substring(0, 500));
    throw new Error('Failed to parse AI response as JSON. The AI returned an unexpected format.');
  }
};

// ─── Main Analysis Function ────────────────────────────────────────────────────
/**
 * Generate a full, comprehensive AI analysis of a resume for a specific job role.
 *
 * This function sends a single detailed prompt to Gemini and returns a structured
 * JSON object containing every aspect of the analysis needed by the frontend.
 *
 * @param {string} resumeText - The plain text content extracted from the resume PDF
 * @param {string} jobRole - The target job role (e.g. "Senior React Developer")
 * @returns {Promise<Object>} Full analysis object matching the Analysis model schema
 */
const generateFullAnalysis = async (resumeText, jobRole) => {
  const prompt = `
You are an expert resume analyst, career coach, and ATS (Applicant Tracking System) specialist with 15+ years of experience in talent acquisition and recruitment across top tech companies.

Your task is to perform a COMPREHENSIVE, DETAILED, and HIGHLY ACCURATE analysis of the resume below for the target job role: "${jobRole}".

Be specific, actionable, and honest. Base ALL your analysis strictly on the actual content of the resume provided. Do NOT fabricate skills, experiences, or qualifications that are not present.

═══════════════════════════════════════════
RESUME TEXT:
═══════════════════════════════════════════
${resumeText}
═══════════════════════════════════════════

Analyze the above resume and return a JSON object with EXACTLY the following structure. Every field is required.

IMPORTANT RULES:
1. Respond with ONLY valid JSON — no markdown, no code fences, no explanation text, no preamble.
2. Be specific and actionable — avoid vague generic feedback.
3. All scores must be integers between 0 and 100.
4. atsScore must reflect how well the resume would pass ATS filters for "${jobRole}".
5. overallRating must be exactly one of: "Poor", "Fair", "Good", "Excellent".
6. suggestions must have at least 5 items ordered from highest to lowest priority.
7. interviewQuestions must include at least 8 questions covering technical, behavioral, and situational categories.
8. coverLetter must be a complete, professional, ready-to-use cover letter (minimum 3 paragraphs).
9. careerRoadmap must have 6 entries covering a 6-month plan.
10. All string arrays must contain real, relevant items — no empty arrays for found skills if skills exist in the resume.
11. companySuggestions must include exactly 8-10 real companies. Use the candidate's actual skills, experience level, and atsScore to determine which tier of companies they can realistically target. Provide working careers page URLs and real company domain names for logos.

JSON STRUCTURE TO RETURN:
{
  "atsScore": <integer 0-100, how well this resume passes ATS for the target role>,
  "overallRating": <"Poor"|"Fair"|"Good"|"Excellent">,
  "summary": "<3-sentence professional assessment: candidate's background, key strengths, and main areas for improvement>",
  "skills": {
    "found": [<array of specific technical and soft skills ACTUALLY present in the resume>],
    "missing": [<array of important skills typically required for ${jobRole} that are NOT in the resume>],
    "recommended": [<array of additional skills that would make this candidate more competitive, beyond just missing ones>]
  },
  "sections": {
    "experience": {
      "score": <integer 0-100>,
      "feedback": "<specific, detailed feedback about the experience section — what works, what needs improvement, specific examples>"
    },
    "education": {
      "score": <integer 0-100>,
      "feedback": "<specific feedback about educational background and its relevance to ${jobRole}>"
    },
    "projects": {
      "score": <integer 0-100>,
      "feedback": "<specific feedback about projects — relevance, detail, use of metrics, tech stack>"
    },
    "summary": {
      "score": <integer 0-100>,
      "feedback": "<specific feedback about the professional summary/objective section>"
    },
    "formatting": {
      "score": <integer 0-100>,
      "feedback": "<feedback about visual layout, readability, ATS friendliness, use of bullet points, length>"
    }
  },
  "suggestions": [
    {
      "section": "<section name e.g. Experience, Skills, Projects, Summary, Formatting, Keywords>",
      "issue": "<specific problem identified in this section>",
      "improvement": "<concrete, actionable improvement with examples where possible>",
      "priority": "<High|Medium|Low>"
    }
  ],
  "keywords": {
    "present": [<array of ATS-relevant keywords already present in the resume>],
    "missing": [<array of important ATS keywords for ${jobRole} that are NOT in the resume>]
  },
  "interviewQuestions": [
    {
      "question": "<realistic interview question this candidate might be asked>",
      "category": "<Technical|Behavioral|Situational>",
      "difficulty": "<Easy|Medium|Hard>"
    }
  ],
  "coverLetter": "<Complete professional cover letter for ${jobRole}. Include: compelling opening, 2-3 paragraphs connecting resume experience to job requirements, closing with call to action. Make it specific to what's in the resume.>",
  "careerRoadmap": [
    {
      "month": "<e.g. Month 1-2>",
      "goal": "<primary goal for this period>",
      "actions": [<array of 3-4 specific, concrete action steps to achieve the goal>]
    }
  ],
  "jobMatch": {
    "score": <integer 0-100, overall match between this candidate and ${jobRole}>,
    "reasoning": "<2-3 sentence explanation of why this score was given, citing specific strengths and gaps>"
  },
  "grammarScore": <integer 0-100, quality of writing, grammar, spelling, and professional tone>,
  "companySuggestions": [
    {
      "name": "<Real company name e.g. Google, Stripe, Notion>",
      "domain": "<company's primary domain for logo e.g. google.com, stripe.com, notion.so>",
      "matchScore": <integer 0-100, how well this candidate matches this company's typical hiring bar>,
      "reason": "<1-2 sentence explanation of WHY this company is a good fit based on the resume's actual skills and experience>",
      "roles": ["<specific job title this candidate should apply for at this company>", "<optional second role>"],
      "applyUrl": "<direct URL to the company's careers page or job listings page, pre-filtered for the role if possible. Must be a real, working URL>",
      "tier": "<exactly one of: Top Tier | Mid Tier | Startup>"
    }
  ]
}

Tier classification rules for companySuggestions:
- "Top Tier": FAANG+, top unicorns (Google, Apple, Meta, Amazon, Microsoft, Netflix, Stripe, Airbnb, Uber, etc.)
- "Mid Tier": Well-funded scaleups, established tech companies (Atlassian, HubSpot, Shopify, Twilio, Datadog, etc.)
- "Startup": Promising early-stage or Series A/B companies in the candidate's domain

Select companies that genuinely match the candidate's skills and experience. If atsScore < 50, bias towards Startup/Mid Tier. If atsScore >= 75, include Top Tier options. Always include a mix of tiers. Order companySuggestions by matchScore descending.
`;

  // Call the Gemini API with the comprehensive prompt
  const rawResponse = await callGemini(prompt);

  // Parse the JSON response
  const analysis = parseJSON(rawResponse);

  return analysis;
};

module.exports = { generateFullAnalysis };
