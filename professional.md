# FresherAI Local Setup Guide

This project is a full-stack app with a React frontend and multiple Node.js backend services. To run it locally, you need to start Redis, start each backend service, and then run the frontend.

## Prerequisites

Make sure the following are installed on your machine:

- Node.js 18+ and npm
- Git
- Docker Desktop (for Redis)
- A MongoDB instance (local or cloud)
- Firebase project credentials
- Razorpay keys
- Any API keys required by the AI services (for example Groq/YouTube)

## 1) Clone the repository

```bash
git clone <your-repository-url>
cd fresherAI
```

## 2) Create environment files

Create or update `.env` files in the app folders before running the project. The app expects configuration values such as:

- `PORT`
- `MONGODB_URL`
- `REDIS_URL`
- `FRONTEND_URL`
- `AUTH_SERVICE_URL`
- `RESUME_SERVICE_URL`
- `INTERVIEW_SERVICE_URL`
- `ROADMAP_SERVICE_URL`
- `BILLING_SERVICE_URL`
- Firebase configuration values
- Razorpay keys
- Any AI provider keys

Examples:

```env
# backend/gateway/.env
PORT=6000
FRONTEND_URL=http://localhost:5173
AUTH_SERVICE_URL=http://localhost:6001
RESUME_SERVICE_URL=http://localhost:6002
INTERVIEW_SERVICE_URL=http://localhost:6003
ROADMAP_SERVICE_URL=http://localhost:6004
BILLING_SERVICE_URL=http://localhost:6005
```

```env
# frontend/.env
VITE_BACKEND_URL=http://localhost:6000
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Each backend service also has its own `.env` file and should include its own `PORT` and required secret/API keys.

## 3) Start Redis

From the backend folder:

```bash
cd backend
docker compose up -d
```

This starts the Redis container used by the app.

## 4) Install backend dependencies

Open a separate terminal for each service and run:

```bash
cd backend/gateway
npm install
npm run dev
```

```bash
cd backend/services/auth
npm install
npm run dev
```

```bash
cd backend/services/resume
npm install
npm run dev
```

```bash
cd backend/services/interview
npm install
npm run dev
```

```bash
cd backend/services/roadmap
npm install
npm run dev
```

```bash
cd backend/services/billing
npm install
npm run dev
```

The backend services will run on these local ports:

- Gateway: `http://localhost:6000`
- Auth: `http://localhost:6001`
- Resume: `http://localhost:6002`
- Interview: `http://localhost:6003`
- Roadmap: `http://localhost:6004`
- Billing: `http://localhost:6005`

## 5) Start the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev -- --host
```

Then open the frontend in the browser:

```text
http://localhost:5173
```

## 6) Common development workflow

If you are working on the project locally:

1. Start Docker for Redis.
2. Start the gateway and all backend services.
3. Start the frontend.
4. Use the app in the browser.

## 7) Production-style Docker build

If you want to build the containers manually:

```bash
cd backend
docker build -f ./gateway/Dockerfile -t gateway .
docker build -f ./services/auth/Dockerfile -t auth-service .
docker build -f ./services/billing/Dockerfile -t billing-service .
docker build -f ./services/interview/Dockerfile -t interview-service .
docker build -f ./services/resume/Dockerfile -t resume-service .
docker build -f ./services/roadmap/Dockerfile -t roadmap-service .
```

Then run them with Docker as needed.

## Troubleshooting

- If Redis is not running, start it again with `docker compose up -d`.
- If the frontend cannot connect to the backend, check `VITE_BACKEND_URL` and gateway port values.
- If a service fails to start, confirm its `.env` file contains valid `PORT` and database/API credentials.
- If MongoDB fails, verify the `MONGODB_URL` is correct and reachable.
- If Firebase or Razorpay features fail, check your config keys in the frontend and backend `.env` files.

## Notes

- The repo uses a multi-service architecture, so do not run only the frontend and expect the backend to work automatically.
- This project depends on external services such as Redis, MongoDB, Firebase, and AI APIs.
- Keep `.env` files private and do not commit them to GitHub.
