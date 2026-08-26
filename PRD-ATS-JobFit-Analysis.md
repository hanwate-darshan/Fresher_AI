# PRD — ATS Job-Fit Analysis

**Product:** FresherAI
**Feature:** ATS Job-Fit Analysis (Resume ↔ Job Description matching)
**Status:** Draft for review
**Owner:** FresherAI Dev Team
**Last Updated:** 2026-08-26

---

## 1. Overview / Problem Statement

FresherAI currently gives a **general ATS resume analysis** (overall score, strengths,
weaknesses, missing skills, suggested role) after a user uploads a resume PDF.

Fresher users struggle with a more specific question: *"Will MY resume pass THIS
specific job I'm applying to?"* They do not know which skills/keywords a particular
job description (JD) requires, whether their resume already covers them, and what
to add before applying.

**This feature answers that question.** The user pastes a job description (JD), the
system compares it against the user's uploaded resume, and returns a job-fit score
with matched skills, missing skills/keywords, and targeted recommendations.

### Why now

- Resume service already extracts structured resume data via AI (skills, projects,
  missing skills, ATS score). Job-fit builds directly on this existing capability.
- High user value: converts generic "your resume is average" into actionable
  "add X, Y, Z to match this exact job."
- Low incremental complexity: one new AI agent, one new model, one new endpoint,
  and a UI section — no new infrastructure.

---

## 2. Goals / Non-Goals

### Goals

- User can paste any JD text and get a resume-vs-JD match analysis.
- Output includes: match score (0–100), matched skills, missing skills,
  missing keywords, resume strengths relevant to the role, and recommendations.
- Previous analyses are stored and viewable (history).
- Feature is protected (requires login) and gated by interview coins.
- Follows existing service patterns (Groq LLM, Redis caching, MongoDB, gateway proxy).

### Non-Goals (out of scope for v1)

- Automatic JD fetching/scraping from external sites (LinkedIn, Naukri, etc.).
- Third-party job description APIs.
- Resume file editing/rewriting.
- Multi-resume (one resume per user, consistent with existing model).

---

## 3. User Stories

| ID | Story |
|----|-------|
| US-1 | As a fresher, I want to paste a job description, so that I can see how well my resume matches that job. |
| US-2 | As a fresher, I want to see which skills from the JD are missing in my resume, so that I know what to learn/add. |
| US-3 | As a fresher, I want actionable recommendations for this specific job, so that I can improve my resume before applying. |
| US-4 | As a fresher, I want a history of my past job-fit analyses, so that I can compare jobs and track progress. |
| US-5 | As a returning user, I want to see a message if I haven't uploaded a resume yet, so that I know to upload first. |

---

## 4. User Flow

```
User lands on "Job Fit" section
        │
        ▼
[Is resume uploaded?] ── No ──► Prompt: "Upload your resume first" (link to Scorer)
        │ Yes
        ▼
Paste Job Description (textarea) + optional Job Title
        │
        ▼
Click "Analyze Job Fit"  (costs coins)
        │
        ▼
Backend: compare resume ↔ JD (AI agent)
        │
        ▼
Show result: match score ring + matched/missing skills + recommendations
        │
        ▼
Result saved to history; user can view past analyses anytime
```

---

## 5. Functional Requirements

### FR-1 — Job-Fit Analysis (core)

- **FR-1.1** User provides a JD (required, non-empty) and an optional job title.
- **FR-1.2** System loads the user's uploaded resume from MongoDB/Redis
  (`Resume.extractedText` + structured fields).
- **FR-1.3** System runs `jobFitAgent` (Groq LLM) with resume text + JD.
- **FR-1.4** Response is parsed and sanitized (same patterns as `uploadResume`:
  strip markdown fences, clamp score 0–100, trim lists, drop nulls).
- **FR-1.5** A `JobFitAnalysis` document is created and returned.
- **FR-1.6** Result is cached in Redis with a TTL (e.g., 24h) keyed by user + JD hash.

### FR-2 — History

- **FR-2.1** `GET /api/resume/job-fit` returns the user's analyses, newest first.
- **FR-2.2** `GET /api/resume/job-fit/:id` returns one analysis (user-scoped).
- **FR-2.3** Each history item shows: job title (if given), match score, created date,
  and can be expanded to full detail.

### FR-3 — Coin Gating

- **FR-3.1** Each job-fit analysis consumes interview coins (frontend calls
  `useCoins` with a dedicated action, mirroring the resume scorer flow).
- **FR-3.2** If coins are insufficient, backend/frontend returns a clear message
  and the analysis is not created.

### FR-4 — Guardrails / Errors

- **FR-4.1** No uploaded resume → 400/404 with "Please upload a resume first".
- **FR-4.2** Empty/invalid JD → 400 "Job description is required".
- **FR-4.3** AI failure / unparseable JSON → 500 with safe error message, no partial
  document saved.
- **FR-4.4** Unauthorized (no session) → gateway returns 401 (existing `isAuth`).

---

## 6. Backend Design

### 6.1 New Mongoose Model — `JobFitAnalysis`

Location: `backend/services/resume-service/model/jobFit.model.js`

```js
{
  userId:        ObjectId,          // indexed, scoping
  jobTitle:      String,            // optional, user-provided
  jobDescription: String,           // JD text (for reference/history)
  matchScore:    Number,            // 0–100
  matchedSkills: [String],
  missingSkills: [String],
  matchedKeywords: [String],
  missingKeywords: [String],
  roleStrengths: [String],          // resume strengths relevant to this JD
  recommendations: [String],
  // timestamps: true
}
```

### 6.2 New AI Agent — `jobFitAgent`

Location: `backend/services/resume-service/agents/jobFit.agent.js`

- Reuses the existing `llm` instance (`configs/llm.js` — Groq `openai/gpt-oss-120b`).
- System prompt (Expert ATS + Hiring Recruiter persona):
  - Compare the resume against the given job description.
  - Extract exactly the JSON fields above.
  - `matchScore`: overall fit 0–100.
  - `matchedSkills`: resume skills that appear/are implied in the JD.
  - `missingSkills`: skills the JD requires but the resume lacks.
  - `matchedKeywords` / `missingKeywords`: important JD keywords present/absent
    (ATS keyword gap).
  - `roleStrengths`: resume strengths that are valuable for this specific role.
  - `recommendations`: concrete, resume-specific improvements (e.g., add a
    Spring Boot project, reword bullets to include "Docker").
- Rules: return ONLY valid JSON, no markdown, no extra text (same as `resumeAgent`).

### 6.3 Routes

Location: `backend/services/resume-service/routes/resume.route.js`

| Method | Path | Handler | Notes |
|--------|------|---------|-------|
| POST   | `/job-fit` | `createJobFit` | body: `{ jobTitle?, jobDescription }` |
| GET    | `/job-fit` | `getAllJobFits` | list, newest first |
| GET    | `/job-fit/:id` | `getJobFitById` | single, user-scoped |

### 6.4 Controller — `controllers/jobFit.controller.js`

- `createJobFit`
  1. Read `userId` from `x-user-id` header (gateway injects it).
  2. Validate `jobDescription` (required, trimmed).
  3. Load user's resume (`Resume.findOne({ userId })`); if none → 400/404.
  4. Call `jobFitAgent(resume.extractedText, jobDescription)`.
  5. Parse + sanitize (reuse `toText/toList/toScore` style helpers).
  6. Save `JobFitAnalysis` (upsert not needed — each run is a new history entry).
  7. Set Redis cache `jobfit:{userId}:{hash(jobDescription)}` with TTL.
  8. Return `200 { success, data }`.
- `getAllJobFits` — `find({ userId }).sort({ createdAt: -1 })`; Redis-cached
  `jobfits:{userId}` list (invalidated on create).
- `getJobFitById` — `findOne({ _id, userId })`; Redis-first via `jobfit:{id}`.

### 6.5 Redis

- `jobfit:{userId}:{jdHash}` — single analysis cache (TTL 24h).
- `jobfits:{userId}` — history list cache (TTL 1h, delete on create).
- Follow existing resume-service pattern (`redis.get/set` from
  `backend/shared/redis/redis.js`).

### 6.6 Gateway

No gateway change needed — `/api/resume/*` is already proxied with `isAuth` +
`proxyWithUser`, so new sub-routes are automatically protected and receive
`x-user-id`.

---

## 7. API Contract

### POST `/api/resume/job-fit`

Request:
```json
{ "jobTitle": "SDE-1 Backend (optional)", "jobDescription": "We are looking for..." }
```

Success 200:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "jobTitle": "SDE-1 Backend",
    "matchScore": 62,
    "matchedSkills": ["Java", "SQL", "Git"],
    "missingSkills": ["Spring Boot", "Docker", "AWS"],
    "matchedKeywords": ["REST API", "MySQL"],
    "missingKeywords": ["CI/CD", "Kubernetes"],
    "roleStrengths": ["Strong Java fundamentals", "Database experience"],
    "recommendations": [
      "Add a Spring Boot project to demonstrate backend skills.",
      "Mention Docker in the deployment section of your experience."
    ],
    "createdAt": "..."
  }
}
```

Error 400:
```json
{ "success": false, "message": "Job description is required" }
```
```json
{ "success": false, "message": "Please upload your resume first" }
```

### GET `/api/resume/job-fit` → `{ success, data: [JobFitAnalysis...] }`
### GET `/api/resume/job-fit/:id` → `{ success, data: JobFitAnalysis }`

---

## 8. Frontend Design

### 8.1 Entry point

Add a **"Job Fit"** nav item in `frontend/src/components/Sidebar.jsx`
(`NAV_ITEMS`) pointing to `/job-fit`. Register route in `App.jsx` (protected
like `/scorer`).

### 8.2 New page — `frontend/src/pages/JobFit.jsx`

Follows the visual style of `Scorer.jsx` (dark cards, `RadialBarChart` score
ring, Tag chips, Navbar).

**State / flow:**
1. On mount, load resume (Redux `resume` slice — already populated by App) and
   existing job-fit history (`getAllJobFits`).
2. If no resume → show "Upload your resume first" with a link to `/scorer`.
3. Input card: optional Job Title input + Job Description textarea +
   "Analyze Job Fit" button (disabled while loading / if JD empty).
4. On submit:
   - Call `useCoins({ coins, action: "job-fit" })` (see 8.3) and update `setUser`
     coins like `Scorer.uploadResume` does.
   - POST `/api/resume/job-fit`, store result in local state + refresh history.
5. Result view (reuse `ScoreRing`-style component):
   - Match score ring + label (Strong / Average / Needs Work).
   - **Matched Skills** (green chips) / **Missing Skills** (red chips) side by side.
   - **Missing Keywords** (yellow chips).
   - **Recommendations** numbered list.
6. History list below: each past analysis → job title, score, date; click to open
   the full detail view (can reuse the same result component).

### 8.3 API module

Add to `frontend/src/api/resume.api.js`:
- `analyzeJobFit(payload)` → `api.post("/api/resume/job-fit", payload)`
- `getAllJobFits()` → `api.get("/api/resume/job-fit")`
- `getJobFitById(id)` → `api.get(\`/api/resume/job-fit/${id}\`)`

Coin usage mirrors `Scorer.jsx:97` (`useCoins({ coins: 10, action: "..." })`);
use a distinct action string (e.g., `"job-fit"`) and the same coins cost as
resume scoring (10) unless decided otherwise.

### 8.4 Components (optional extraction)

- `JobFitResult` — shared result card used by fresh analysis and history detail.
- `ScoreRing` — reuse pattern from `Scorer.jsx` (RadialBarChart).

---

## 9. Non-Functional Requirements

- **Security:** All routes behind gateway `isAuth`; all queries scoped by `userId`.
- **Performance:** Redis caching prevents repeat LLM calls for identical JD;
  history loads fast from cache.
- **Reliability:** Sanitized parsing + graceful error responses; no partial data
  saved on failure.
- **Consistency:** Matches existing resume-service code style (ESM imports,
  `shared/redis`, helper sanitizers, camelCase JSON).
- **Observability:** `console.log` on errors (consistent with repo), clear
  success/error messages in API responses.

---

## 10. Acceptance Criteria

1. Logged-in user with an uploaded resume can paste a JD and receive a match
   score + matched/missing skills + keywords + recommendations.
2. Analysis is stored and appears in history (newest first).
3. History detail can be reopened.
4. User without a resume sees a clear "upload resume first" message.
5. Invalid/empty JD returns 400 without creating a record.
6. Coins are deducted on each analysis; insufficient coins block the action.
7. Duplicate identical JD within cache TTL returns cached result (no new record
   and no double coin charge — coin deduct still applies, see note).
8. `npm run lint` passes in `frontend`; services start without errors.

---

## 11. Implementation Plan

**Phase 1 — Backend**
1. Create `model/jobFit.model.js`.
2. Create `agents/jobFit.agent.js`.
3. Create `controllers/jobFit.controller.js` (create / list / getById + Redis).
4. Add routes in `routes/resume.route.js`.
5. Manual test with curl/Postman (upload resume → job-fit → history).

**Phase 2 — Frontend**
1. Add API functions in `src/api/resume.api.js`.
2. Create `src/pages/JobFit.jsx` (+ optional `JobFitResult` component).
3. Register route in `App.jsx`.
4. Add "Job Fit" item in `Sidebar.jsx`.
5. Manual test end-to-end; run `npm run lint`.

**Phase 3 — Polish**
- Loading/empty/error states.
- Confirm coin cost + action string.
- Optional: cache-friendly JD hash.

---

## 12. Future Scope (out of v1)

- JD auto-fetch from URL / job platforms.
- Job title → preset JD templates.
- "Copy improvements" / resume edit suggestions.
- Shareable job-fit report (PDF).
- Integration with job recommendations + application tracking.
