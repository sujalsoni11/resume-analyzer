# 🚀 ResumeAI — AI-Powered Resume Analyzer

> **Analyze. Improve. Get Hired.**  
> A production-grade, full-stack AI Resume Analyzer built with the MERN stack and Google Gemini AI.

![Stack](https://img.shields.io/badge/Stack-MERN-C8FF00?style=flat-square&labelColor=0D3333)
![License](https://img.shields.io/badge/License-MIT-C8FF00?style=flat-square&labelColor=0D3333)
![Deployment](https://img.shields.io/badge/Deploy-Vercel%20(Full%20Stack)-C8FF00?style=flat-square&labelColor=0D3333)

---

## ✨ Features

### 🤖 AI-Powered Analysis (Google Gemini 1.5 Flash)
- **ATS Score Generation** — 0–100 score based on job role alignment
- **Skill Gap Detection** — Found vs. Missing vs. Recommended skills
- **Section-by-Section Scoring** — Experience, Education, Projects, Summary, Formatting
- **Improvement Suggestions** — Prioritized, actionable bullet points
- **Interview Question Generation** — 10 tailored questions with difficulty ratings
- **AI Cover Letter Generation** — Professional, personalized cover letters
- **Career Roadmap** — 6-month step-by-step plan
- **Job Role Matching** — % match score with reasoning
- **Keyword Optimization** — Present vs. missing ATS keywords
- **Grammar Score** — Resume language quality check

### 📊 Dashboard & Analytics
- ATS score history charts
- Total analyses, avg score, best score
- Recently analyzed resumes
- Bookmarked improvements

### 🔐 Authentication
- JWT-based secure authentication
- Email/Password Register & Login
- **Google OAuth 2.0** (Sign in / Sign up with Google)
- Protected routes
- Account deletion

### 📄 Resume Management
- PDF upload with drag-and-drop
- Resume version history
- PDF text extraction
- Delete resumes

### 💾 Download & Export
- Download full analysis report (JSON)
- Copy cover letter to clipboard
- Bookmark / unbookmark specific analyses
- Delete analyses

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| Animations | Framer Motion |
| Charts | Recharts + react-circular-progressbar |
| UI Icons | Lucide React |
| Notifications | react-hot-toast |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + Google OAuth 2.0 |
| File Upload | Multer |
| PDF Parsing | pdf-parse |
| AI | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| Security | Helmet, express-rate-limit, express-validator, bcryptjs |
| Frontend Deploy | Vercel |
| Backend Deploy | Vercel (Serverless via `api/index.js`) |
| DB Hosting | MongoDB Atlas |

---

## 📁 Project Structure

```
resume-analyzer/
├── frontend/                  # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/        # ATSGauge, SkillRadar, ScoreHistory
│   │   │   ├── layout/        # Navbar, Sidebar, DashboardLayout
│   │   │   ├── resume/        # DropZone
│   │   │   └── ui/            # Button, Badge, Card, LoadingSpinner
│   │   ├── context/           # AuthContext
│   │   ├── hooks/             # useAuth, useAnalysis
│   │   ├── pages/             # Landing, Login, Register, Dashboard, Analyze, Results, History, Profile
│   │   ├── services/          # api.js (Axios)
│   │   └── utils/             # helpers.js
│   ├── index.html
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json
│
├── backend/                   # Node.js + Express API
│   ├── api/
│   │   └── index.js           # Vercel serverless entry point
│   ├── server.js              # Local development entry point
│   ├── src/
│   │   ├── app.js             # Express app setup
│   │   ├── controllers/       # authController, resumeController, analysisController, userController
│   │   ├── middleware/        # auth.js, upload.js, errorHandler.js
│   │   ├── models/            # User.js, Resume.js, Analysis.js
│   │   ├── routes/            # auth.js, resume.js, analysis.js, user.js
│   │   ├── services/          # aiService.js (Gemini), pdfService.js
│   │   └── utils/             # helpers.js
│   ├── .env.example
│   ├── vercel.json
│   └── render.yaml
│
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (free tier works)
- Google Gemini API key (free at [ai.google.dev](https://ai.google.dev))
- Google OAuth Client ID (optional, for Google Sign-In)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** — copy and fill in `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

Fill in:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/resume-analyzer
JWT_SECRET=your_secret_key_at_least_32_characters
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

**Frontend** — copy and fill in `frontend/.env`:
```bash
cp frontend/.env.example frontend/.env
```

Fill in:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id   # optional
```

### 3. Start Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# → API running at http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# → App running at http://localhost:5173
```

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account (email/password) | ❌ |
| POST | `/api/auth/login` | Login (email/password) | ❌ |
| POST | `/api/auth/google` | Google OAuth login / register | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |
| PUT | `/api/auth/change-password` | Change password | ✅ |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/profile` | Get user profile with stats | ✅ |
| DELETE | `/api/users/account` | Delete account permanently | ✅ |

### Resumes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/resumes` | Upload resume (PDF) | ✅ |
| GET | `/api/resumes` | List all resumes | ✅ |
| GET | `/api/resumes/:id` | Get single resume | ✅ |
| DELETE | `/api/resumes/:id` | Delete resume | ✅ |

### Analysis
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/analysis` | Create analysis | ✅ |
| GET | `/api/analysis` | Get analysis history | ✅ |
| GET | `/api/analysis/dashboard` | Dashboard stats | ✅ |
| GET | `/api/analysis/bookmarks` | Bookmarked analyses | ✅ |
| GET | `/api/analysis/:id` | Get single analysis | ✅ |
| PATCH | `/api/analysis/:id/bookmark` | Toggle bookmark | ✅ |
| GET | `/api/analysis/:id/download` | Download report (JSON) | ✅ |
| DELETE | `/api/analysis/:id` | Delete analysis | ✅ |

---

## ☁️ Deployment

Both frontend and backend are deployed to **Vercel**.

### Frontend → Vercel

1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set root directory: `frontend`
4. Add environment variables:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```
5. Deploy!

### Backend → Vercel (Serverless)

The backend uses `api/index.js` as the Vercel serverless entry point (configured in `backend/vercel.json`).

1. Go to [vercel.com](https://vercel.com) → New Project → Import repo
2. Set root directory: `backend`
3. Add all environment variables from `backend/.env.example`
4. Deploy!

> **Note:** For local development, use `npm run dev` which starts `server.js` (not the Vercel entry point).

### Database → MongoDB Atlas

1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create database user
3. Whitelist IP: `0.0.0.0/0` (for Vercel serverless)
4. Copy connection string → set as `MONGODB_URI` in Vercel env vars

---

## 🔑 Getting API Keys

### Google Gemini API Key (Free)
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy key → set as `GEMINI_API_KEY` in `.env`
4. Free tier: 15 RPM, 1M tokens/day

### Google OAuth Client ID (for Google Sign-In)
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → Enable "Google Identity Services"
3. Go to **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
4. Add your frontend domain to **Authorized JavaScript Origins**
5. Copy Client ID → set as `VITE_GOOGLE_CLIENT_ID` in frontend `.env`

---

## 📊 MongoDB Schemas

### User
```js
{ name, email, password, avatar, plan, totalAnalyses, bookmarks[], createdAt }
```

### Resume
```js
{ userId, filename, originalName, fileSize, parsedText, wordCount, version, uploadedAt }
```

### Analysis
```js
{ userId, resumeId, jobRole, atsScore, overallRating, summary, skills, sections,
  suggestions[], keywords, interviewQuestions[], coverLetter, careerRoadmap[],
  jobMatch, grammarScore, bookmarked, downloadCount, createdAt }
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#F2EFE4` (cream) |
| Primary | `#0D3333` (dark teal) |
| Accent | `#C8FF00` (neon lime) |
| Font Display | Big Shoulders Display 900 |
| Font Body | Inter 400/600/700 |

---

## 📝 License

MIT © 2025 — Built for FAANG-level portfolio showcase

---

## ⭐ Show Support

If this project helped you, give it a ⭐ on GitHub!
