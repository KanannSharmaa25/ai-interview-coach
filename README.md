# AI Interview Coach

A full-stack AI Interview Coach with Firebase auth, OpenAI-powered interviews and feedback, PDF resume analysis, Stripe subscriptions, and Web Speech voice.

## Features

- **AI Mock Interview** — Role/difficulty, real-time AI questions and follow-ups, voice + text input, TTS for questions
- **AI Feedback** — Communication, confidence, technical, STAR, filler-word counts, suggestions (OpenAI)
- **Resume Analyzer** — PDF upload or paste text, ATS score, keyword match, skill gaps (OpenAI + pdf-parse)
- **Job Match** — Paste JD (+ optional resume), match %, missing skills, suggested answers (OpenAI)
- **Behavioral Trainer** — Paste answer → AI STAR rewrite (OpenAI)
- **Analytics** — Readiness score, streak, weak-topic heatmap, interview history (from DB)
- **Voice** — Web Speech API: STT in Mock Interview and Voice Assistant, TTS for AI questions
- **Auth** — Firebase (Google / LinkedIn): idToken → backend creates/updates user, all API calls use Bearer token
- **Subscription** — Free (3 mocks/month), Premium via Stripe Checkout; webhook updates `plan`
- **Database** — PostgreSQL + Prisma: User, Interview, ResumeAnalysis, JobMatch

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, React Router, Recharts, Lucide, Firebase SDK, Stripe (checkout)
- **Backend:** Node.js, Express, TypeScript, Prisma, Firebase Admin, OpenAI, pdf-parse, Stripe

## Setup

### 1. Install

```bash
npm run install:all
# or: npm install && cd client && npm install && cd ../server && npm install
```

### 2. Environment

**Server** (`server/.env` — copy from `server/.env.example`):

- `DATABASE_URL` — PostgreSQL connection string (used in `prisma.config.ts`)
- `FIREBASE_SERVICE_ACCOUNT_JSON` — Firebase service account JSON string (for verifying id tokens)
- `OPENAI_API_KEY` — For interview, feedback, resume, job match, behavioral
- `STRIPE_SECRET_KEY`, `STRIPE_PREMIUM_PRICE_ID`, `STRIPE_WEBHOOK_SECRET` — Optional; for Premium
- `PORT` — Default 3001

**Client** (`client/.env` — copy from `client/.env.example`):

- `VITE_API_URL` — e.g. `http://localhost:3001/api` (or leave unset to use `/api` with proxy)
- `VITE_FIREBASE_*` — Firebase project config for Google/LinkedIn sign-in

### 3. Database

```bash
cd server
npx prisma migrate dev   # create DB and run migrations
# or use existing DB and ensure schema is applied
```

### 4. Run

```bash
# From repo root: frontend (5173) + backend (3001)
npm run dev
```

Or separately:

```bash
cd server && npm run dev
cd client && npm run dev
```

- **App:** http://localhost:5173  
- **API:** http://localhost:3001 (e.g. `/api/health`)

## Sign in

- With Firebase configured: use **Continue with Google** or **Continue with LinkedIn**; backend creates/updates user and returns profile; all API requests send the Firebase idToken.
- Without Firebase: **Continue with Google/LinkedIn** uses mock user (no backend auth); API calls that require auth will 401 unless you add a dev bypass.

## Stripe

1. Create a Product and recurring Price in Stripe; set `STRIPE_PREMIUM_PRICE_ID`.
2. **Checkout:** User clicks “Upgrade to Premium” in Settings → `POST /api/stripe/create-checkout-session` (auth required) → redirect to Stripe Checkout.
3. **Webhook:** Point Stripe to `POST /api/stripe/webhook` (raw body). On `checkout.session.completed` or `customer.subscription.updated`/`deleted`, update user `plan` in the DB.

## Project structure

```
├── client/
│   ├── src/
│   │   ├── components/   # Button, Card, Sidebar, ProgressBar, ScoreRing
│   │   ├── hooks/        # useAuth, useSpeech (STT/TTS)
│   │   ├── lib/          # firebase, api (fetch + Bearer token)
│   │   ├── layouts/      # DashboardLayout
│   │   └── pages/        # Landing, Login, Dashboard, MockInterview, etc.
│   └── .env.example
├── server/
│   ├── prisma/           # schema.prisma (User, Interview, ResumeAnalysis, JobMatch)
│   ├── prisma.config.ts  # DATABASE_URL
│   ├── src/
│   │   ├── lib/          # db (Prisma), firebase (verifyIdToken), openai, stripe
│   │   ├── middleware/   # auth (requireAuth, optionalAuth, requirePremium), limits (free mock count)
│   │   └── routes/       # auth, interview, resume, job, behavioral, analytics, stripe
│   └── .env.example
├── package.json          # scripts: dev, install:all
└── README.md
```

## Implemented end-to-end

- **Auth:** Firebase client sign-in → idToken → `POST /api/auth/login` → create/update User; `requireAuth` on protected routes; token from `auth.currentUser.getIdToken()` in `api.ts`.
- **Interview:** `POST /api/interview/start` (role, difficulty) → OpenAI first question; `POST /api/interview/answer` (interviewId, question, answer) → OpenAI next question + feedback; free tier limit (e.g. 3/month) in `limits.ts`.
- **Resume:** `POST /api/resume/analyze` (multipart: file and/or `resumeText`, `jobDescription`) → pdf-parse for PDF → OpenAI analysis → store in ResumeAnalysis.
- **Job match:** `POST /api/job/match` (jobDescription, optional resumeText) → OpenAI → store in JobMatch.
- **Behavioral:** `POST /api/behavioral/improve` (answer) → OpenAI STAR rewrite.
- **Analytics:** `GET /api/analytics/overview` → from Interview records (scores, streak, weak topics, history).
- **Voice:** Mock Interview and Voice Assistant use `useSpeechRecognition` and `useSpeechSynthesis` (Web Speech API).
- **Stripe:** Checkout session creation (auth) and webhook handler (raw body) to set user `plan`.

  
📊 Workflow

User uploads resume / selects job role

AI generates interview questions

User answers via text, voice, or video

AI analyzes responses in real time

Feedback, scores, and improvement tips are generated

Progress is stored and tracked over time

🎯 Use Cases

College students preparing for placements

Job seekers practicing interviews

Final-year project demonstration

Resume & skill improvement

🧪 Future Enhancements

AI Interviewer avatars

Multilingual interview support

Peer comparison & ranking

Recruiter dashboard

Mobile application

🏆 Project Highlights

Real-world interview simulation

Personalized AI feedback

Strong resume-worthy AI project

Scalable and industry-relevant

📄 License

This project is for educational and academic purposes.

✨ Author

Kanan Sharma
Computer Science & Data Science Student
