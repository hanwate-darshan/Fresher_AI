<div align="center">
  <img width="226" alt="Fresher.AI Logo" src="https://github.com/pattjoshi/Fresher-Multi-Agent-AI-/blob/master/frontend/public/logo.png">

  # Fresher.AI
  ### Intelligent End-to-End Career Acceleration Platform for Freshers & Early Professionals

  <p align="center">
    <b>AI Resume Optimization</b> • <b>ATS Job-Fit Analysis</b> • <b>AI Cover Letter Generator</b> • <b>AI Career Coach</b> • <b>Mock Interviews</b> • <b>Personalized Roadmaps</b>
  </p>
</div>

---

## 📌 Overview

**Fresher.AI** is an all-in-one AI-driven career growth ecosystem engineered to solve the hardest challenges freshers face in the hiring market. From crafting ATS-optimized resumes and tailored cover letters to practicing voice/video mock interviews and getting 24/7 personalized mentorship from an AI Career Coach, Fresher.AI equips candidates with everything needed to land their dream software engineering roles.

---

## 🚀 Key Feature Suite

### 1. 🤖 AI Career Coach Chatbot (`/career-coach`) *(New)*
- **Resume-Aware Intelligence:** Automatically accesses the candidate's uploaded resume to provide personalized, non-generic career guidance.
- **24/7 Fresher Mentorship:** Tailored advice on off-campus hiring cycles in India, standout portfolio projects, salary negotiation tactics, and HR answer framing.
- **Interactive Chat Experience:** Clean Black & White UI with 1-click prompt chips, clipboard copy, live resume status indicator, and sliding conversational memory powered by **Groq LLM** & **LangChain**.
- **Free Mentor Feature:** Zero coin cost for continuous guidance and high student retention.

### 2. ✉️ AI Cover Letter Generator (`/cover-letter`) *(New)*
- **Job-Specific Tailoring:** Cross-references the candidate's resume with any pasted Job Description (JD).
- **ATS Keyword Alignment:** Naturally integrates essential JD keywords and requirements into high-converting 3-4 paragraph letters.
- **Persistent History & Caching:** Saves generated letters to MongoDB with high-speed Redis caching (`GET /api/resume/cover-letter`).
- **1-Click Clipboard Export:** Instant copy to clipboard with formatting preserved.

### 3. 🎯 Job-Fit Analysis & ATS Gap Scorer (`/job-fit`)
- **Compatibility Score:** Calculates a precise match percentage against any job description.
- **Skill Gap Analysis:** Pinpoints exact missing keywords, skills, and experience criteria.
- **Actionable Optimization:** Provides tailored recommendations to boost resume match rates before applying.

### 4. 📄 AI Resume Builder & ATS Scorer (`/resume`, `/scorer`)
- **Step-by-Step Builder:** Guided multi-step creation for contact info, summary, technical skills, work experience, projects, and education.
- **Live ATS Preview:** Real-time formatting preview with responsive scaling.
- **Instant ATS Scoring:** Evaluates uploaded PDF resumes for ATS readability and impact.

### 5. 🎙️ AI Mock Interview Simulation (`/interview`)
- **Multi-Track Interviews:** Simulations for HR, Technical, and Coding rounds.
- **Voice Recognition & Speech Synthesis:** Interactive voice-to-text answers and realistic AI voice question prompts.
- **Integrated Code Editor:** Real-time coding workspace with timer constraints.
- **Comprehensive Scorecards:** Post-interview breakdown of technical depth, communication clarity, and granular question-by-question feedback.

### 6. 🗺️ Personalized Learning Roadmap Generator (`/roadmap`)
- **Target Role Roadmaps:** Custom learning paths tailored to specific targets (Frontend, Backend, Full Stack, ML, DevOps) and target CTC goals.
- **Milestone-Based Learning:** Structured checkpoints with curated study topics and practice tasks.
- **Resume Context Integration:** Skips concepts the candidate already knows and focuses on bridging their skill gaps.

### 7. 📊 Performance Dashboard & Career Growth Accelerators (`/dashboard`)
- **Centralized Metrics:** Total interviews taken, questions answered, completion rate, and average performance score.
- **Historical Performance Graph:** Visual trend breakdown across technical and HR evaluations.
- **🚀 AI Accelerators Suite:** Interactive quick-access cards for AI Career Coach, Cover Letter Generator, and Job Fit Analysis featuring smooth hover-black animations and glass sheen effects.

### 8. 🪙 Coin Economy & Razorpay Billing (`/pricing`)
- **Usage-Based Monetization:** Seamless coin-based deductions for compute-heavy AI operations.
- **Razorpay Payment Gateway:** Secure purchasing of coin packs.

---

## 🏗️ Architecture & System Design

Fresher.AI operates on a high-throughput, modular **Microservices Architecture** coordinated by an API Gateway:

```text
                        ┌─────────────────────────────────────┐
                        │      Frontend (React + Vite)        │
                        └──────────────────┬──────────────────┘
                                           │ HTTP / Cookies
                                           ▼
                        ┌─────────────────────────────────────┐
                        │      API Gateway (Express :5000)    │
                        └──────┬──────────┬──────────┬────────┘
                               │          │          │
         ┌─────────────────────┼──────────┴──────────┼─────────────────────┐
         ▼                     ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Auth Service   │  │  Resume Service  │  │Interview Service │  │ Roadmap Service  │
│     (:5001)      │  │     (:5002)      │  │     (:5003)      │  │     (:5004)      │
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                     │                     │                     │
         ▼                     ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   MongoDB Auth   │  │  MongoDB Resume  │  │ MongoDB Interview│  │ MongoDB Roadmap  │
└──────────────────┘  └────────┬─────────┘  └────────┬─────────┘  └──────────────────┘
                               │                     │
                               └──────────┬──────────┘
                                          ▼
                               ┌─────────────────────┐
                               │  Shared Redis Cache │
                               │       (:6379)       │
                               └─────────────────────┘
```

---

## 💻 Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Motion (Framer Motion), Redux Toolkit, React Router, Axios, React Icons, Recharts |
| **Backend Services** | Node.js, Express.js 5, express-http-proxy, Mongoose, Multer, cookie-parser, morgan |
| **AI & LLM Orchestration** | LangChain Core, LangChain Groq, Google Generative AI, pdf-parse |
| **Databases & Cache** | MongoDB Atlas, Redis (Shared Distributed Cache) |
| **Authentication & Payments** | JWT / Cookies, Firebase Authentication, Razorpay SDK |
| **DevOps & Tooling** | Docker, Docker Compose, Git |

---

## 📂 Repository Structure

```text
Fresher_AI/
├── .gitignore                      # Monorepo gitignore (secrets, uploads, builds)
├── README.md                       # Complete platform documentation
├── APPLICATION_OVERVIEW.md         # Architecture and design notes
├── future-planning.md              # Long-term feature roadmap
│
├── backend/
│   ├── docker-compose.yml          # Container configuration (Redis, etc.)
│   ├── gateway1/                   # Reverse proxy & auth routing gateway (:5000)
│   ├── shared/                     # Shared utilities & Redis client
│   └── services/
│       ├── auth-service1/          # User authentication & profile management (:5001)
│       ├── resume-service1/        # Resume Builder, Scorer, Job-Fit, Cover Letter, Career Coach (:5002)
│       │   ├── agents/             # LangChain agents (careerCoach, coverLetter, jobFit)
│       │   ├── controllers/        # Service controllers
│       │   ├── model/              # MongoDB schemas (Resume, JobFit, CoverLetter)
│       │   └── routes/             # Resume & Career service routes
│       ├── interview-service1/     # AI Mock Interview engine & question evaluation (:5003)
│       ├── roadmap-service1/       # Personalized learning roadmap generator (:5004)
│       └── billing-service1/       # Razorpay coin packs & transaction management (:5005)
│
└── frontend/                       # React + Vite client application
    ├── src/
    │   ├── api/                    # Axios API service clients (resume.api, interview.api, etc.)
    │   ├── components/             # Reusable UI components (Sidebar, StatBox, LoginModal, etc.)
    │   ├── pages/                  # Route views:
    │   │   ├── Home.jsx            # Landing page with 6-Agent Ecosystem showcase
    │   │   ├── Dashbord.jsx        # Performance metrics & Career Growth Tools
    │   │   ├── CareerCoach.jsx     # AI Career Coach chat interface (New)
    │   │   ├── CoverLetter.jsx     # AI Cover Letter Generator & History (New)
    │   │   ├── JobFit.jsx          # Resume-to-JD match analysis
    │   │   ├── Scorer.jsx          # ATS score analyzer
    │   │   ├── ResumeBuilder.jsx   # Interactive resume builder
    │   │   ├── InterviewPage.jsx   # Live mock interview workspace
    │   │   └── Roadmap.jsx         # Custom milestone learning roadmap
    │   ├── redux/                  # Redux slices for resume and user state
    │   └── utils/                  # Axios interceptors and helper utilities
    ├── package.json
    └── vite.config.js
```

---

## ⚡ Local Development Setup

### Prerequisites
- [Node.js (v18+)](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/) (for Redis)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- Groq Cloud API Key & Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/hanwate-darshan/Fresher_AI.git
cd Fresher_AI
```

### 2. Start Shared Redis Cache
```bash
cd backend
docker compose up -d
cd ..
```

### 3. Configure Environment Variables
Create `.env` files in each service directory based on their respective requirements (refer to `APPLICATION_OVERVIEW.md`).

### 4. Start Backend Microservices
Run each service in a separate terminal:

```bash
# 1. API Gateway
cd backend/gateway1 && npm install && npm run dev

# 2. Auth Service
cd backend/services/auth-service1 && npm install && npm run dev

# 3. Resume Service (Includes Cover Letter & Career Coach)
cd backend/services/resume-service1 && npm install && npm run dev

# 4. Interview Service
cd backend/services/interview-service1 && npm install && npm run dev

# 5. Roadmap Service
cd backend/services/roadmap-service1 && npm install && npm run dev

# 6. Billing Service
cd backend/services/billing-service1 && npm install && npm run dev
```

### 5. Start Frontend Client
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🔮 Future Planning & Product Roadmap

Refer to [`future-planning.md`](file:///c:/Users/darsh/Downloads/Fresher_AI/future-planning.md) for complete details on upcoming milestones:
- [x] **AI Career Coach Chatbot** *(Completed)*
- [x] **AI Cover Letter Generator** *(Completed)*
- [ ] **Skill Assessment Hub & MCQs:** Automated tests and coding challenges with domain benchmarking.
- [ ] **Job Board Integration:** Live job feed recommendations based on candidate profile and resume score.
- [ ] **Advanced Video Expression Analysis:** Camera-based facial confidence and eye-contact assessment during mock interviews.
- [ ] **Campus / Placement Admin Portal:** Dedicated dashboards for college placement cells to track batch readiness.

---

## 📄 License
This project is developed for educational and career-readiness purposes. Check repository licenses for commercial or production distribution.
