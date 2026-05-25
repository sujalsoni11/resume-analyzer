# 🚀 ResumeAI — AI-Powered Resume Analyzer

> **Analyze. Improve. Get Hired.**  
> A production-grade, full-stack AI Resume Analyzer built with the MERN stack and Google Gemini AI.

![ResumeAI Banner](https://img.shields.io/badge/Stack-MERN-C8FF00?style=flat-square&labelColor=0D3333)
![License](https://img.shields.io/badge/License-MIT-C8FF00?style=flat-square&labelColor=0D3333)
![Deployment](https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-C8FF00?style=flat-square&labelColor=0D3333)

---

## ✨ Features

### 🤖 AI-Powered Analysis (Google Gemini)
- **ATS Score Generation** — 0-100 score based on job role alignment
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
- Register / Login / Profile management
- Protected routes

### 📄 Resume Management
- PDF upload with drag-and-drop
- Resume version history
- PDF text extraction
- Delete resumes

### 💾 Download & Export
- Download full analysis report (JSON)
- Copy cover letter to clipboard
- Bookmark specific analyses

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| Animations | Framer Motion |
| Charts | Recharts + react-circular-progressbar |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken) |
| File Upload | Multer |
| PDF Parsing | pdf-parse |
| AI | Google Gemini 1.5 Flash |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |
| DB Hosting | MongoDB Atlas |

---

## 📁 Project Structure

```
resume-analyzer/
├── frontend/                  # React + Vite frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/        # ATSGauge, SkillRadar, ScoreHistory
│   │   │   ├── layout/        # Navbar, Sidebar, DashboardLayout
│   │   │   ├── resume/        # DropZone
│   │   │   └── ui/            # Button, Badge, Card, LoadingSpinner
│   │   ├── context/           # AuthContext, ThemeContext
│   │   ├── hooks/             # useAuth, useAnalysis
│   │   ├── pages/             # Landing, Login, Register, Dashboard, Analyze, Results, History, Profile
│   │   ├── services/          # api.js (Axios)
│   │   └── utils/             # helpers.js
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json
│
├── backend/                   # Node.js + Express API
│   ├── src/
│   │   ├── controllers/       # authController, resumeController, analysisController, userController
│   │   ├── middleware/        # auth.js, upload.js, errorHandler.js
│   │   ├── models/            # User.js, Resume.js, Analysis.js
│   │   ├── routes/            # auth.js, resume.js, analysis.js, user.js
│   │   ├── services/          # aiService.js (Gemini), pdfService.js
│   │   ├── utils/             # helpers.js
│   │   └── app.js
│   ├── .env.example
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
| POST | `/api/auth/register` | Create account | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |
| PUT | `/api/auth/change-password` | Change password | ✅ |

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
| GET | `/api/analysis/:id/download` | Download report | ✅ |

---

## ☁️ Deployment

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set root directory: `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy!

### Backend → Render

1. Push `backend/` to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Set root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables from `.env.example`
7. Deploy!

### Database → MongoDB Atlas

1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create database user
3. Whitelist IP: `0.0.0.0/0` (for Render)
4. Copy connection string → set as `MONGODB_URI` in Render env vars

---

## 🔑 Getting API Keys

### Google Gemini API Key (Free)
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy key → set as `GEMINI_API_KEY` in `.env`
4. Free tier: 15 RPM, 1M tokens/day

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
