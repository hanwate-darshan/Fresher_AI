
<div align="center">
      <img width="226" alt="image" src="https://github.com/pattjoshi/Fresher-Multi-Agent-AI-/blob/master/frontend/public/logo.png">

##  Fresher AI 


FresherAI is an intelligent career growth platform built for freshers and early-career professionals. It combines AI-powered resume optimization, interview preparation, personalized learning roadmaps, analytics, and secure user access into one unified experience. The platform is designed to help users improve their resume, practice real-world interviews, get actionable feedback, and build a clear learning path toward their desired job roles and salary targets.

</div>

<h3 ><a href="https://github.com/pattjoshi/Fresher-Multi-Agent-AI-/tree/master#screenshot">Click to move screenshot  section </a></h3>


## Why FresherAI

Most job seekers struggle with three major problems:

- creating an ATS-friendly resume that stands out
- practicing interviews without structured feedback
- not knowing what to learn next to reach a target role or package

FresherAI addresses all three by combining multiple AI agents and services into a single career preparation platform.

## Key Features

### 1. AI Resume Builder

- Create and edit professional resumes step by step
- Add personal details, summary, skills, work experience, projects, and education
- Preview resume content before finalizing
- Build ATS-friendly resumes tailored for job applications
- Save and manage resume data for future use

### 2. AI Interview Preparation

- Simulate interview sessions with AI-driven questions
- Support for technical, HR, and coding interview workflows
- Real-time interview flow with an interactive coding/editor experience
- Track interview history and performance trends
- View detailed scoring reports after each session
- Measure performance across technical and HR dimensions

### 3. Interview Feedback and Analytics

- Generate performance insights after each interview
- Review answer quality and evaluation structure
- Track total interviews, total questions attempted, completion rate, and average score
- Monitor user progress over time with visual analytics dashboards
- Analyze strengths and identify weak areas for improvement

### 4. Personalized AI Roadmap Generator

- Create a roadmap for a target role such as Frontend Developer, Backend Engineer, or ML Engineer
- Generate learning paths customized to user goals and salary expectations
- Use a resume-based context when available
- Build focused, actionable study plans to improve skills systematically
- Access roadmap history and previously generated plans

### 5. Career Dashboard

- Centralized overview of interview performance
- Visual metrics and charts for interview stats
- Quick navigation to resume, interview, roadmap, and billing modules
- User-specific dashboard experience after login

### 6. User Authentication and Access Control

- Secure login and user session handling
- Firebase-powered authentication
- Protected routes for application features
- Logout and session-based access management

### 7. Subscription and Billing

- Razorpay-powered billing integrations
- Plans and premium feature access
- User coin-based activity tracking for AI features
- Monetization support for premium career features

### 8. Multi-Service Backend Architecture

- Gateway service for request routing and proxying
- Independent backend services for auth, resume, interview, roadmap, and billing
- Modular architecture for easier scaling and maintenance
- Shared Redis integration for caching and fast access


## screenshot   


<table>
  <tr>
    <td><img width="960" alt="image" src="https://github.com/user-attachments/assets/cfaf8423-a167-4f3d-9715-1252eadd7e04" alt="mockup"/></td>
    <td><<img width="960" alt="image" src="https://github.com/user-attachments/assets/e6d3ff96-7ade-4078-a04f-b45412d5cfdd" alt="mockup"/></td>
  </tr>
  <tr>
    <td><img width="960" alt="image" src="https://github.com/user-attachments/assets/7024f6a2-4a20-4277-93c0-cd3b58fc8876"alt="mockup"/></td>
    <td><img width="960" alt="image" src="https://github.com/user-attachments/assets/0901e260-c376-4c8f-8b07-b0f1ef98d730"alt="mockup"/></td>
  </tr>
</table>


## Project Architecture

The application uses a modular microservice-style backend with a React frontend.

- Frontend: React + Vite
- Backend: Node.js + Express
- Service routing: API Gateway
- Database: MongoDB
- Caching: Redis
- Authentication: Firebase + secure backend sessions
- Payments: Razorpay
- Containerization: Docker

## System Overview

```text
Frontend (React + Vite)
        |
        v
API Gateway (Express)
  |  |  |  |  |
  v  v  v  v  v
Auth Resume Interview Roadmap Billing
  |      |       |        |
  v      v       v        v
MongoDB MongoDB MongoDB MongoDB
  |
  v
Redis
```

## Tech Stack

### Frontend

- React
- Vite
- JavaScript / JSX
- Tailwind-inspired styling
- Motion UI animations
- React Router
- Redux Toolkit
- Firebase client configuration
- Axios for API calls

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- Redis
- dotenv configuration
- Firebase Admin SDK
- Razorpay SDK

### DevOps and Utilities

- Docker
- Docker Compose
- Node package management
- Environment-based configuration

## Application Modules

### Landing Page

The app starts with a polished landing page that introduces the product and highlights its AI-driven job preparation tools.

### Dashboard

Users get a performance dashboard displaying:

- total interviews created
- total questions answered
- completed interviews
- average score
- historical interview charts

### Resume Builder

The resume module helps users build a structured resume in multiple sections, including:

- profile summary
- skills
- experience
- projects
- education

### Interview Module

The interview feature supports a guided flow where users can:

- start a session
- answer AI-generated interview questions
- proceed through multiple stages of interview practice
- receive automated scoring and evaluation reports

### Roadmap Builder

Users can define a target role and package and receive a personalized roadmap that helps them learn the right skills in the correct order.

### Billing Module

The billing module supports premium access and key subscription-related flows through Razorpay.

## Core Workflow

1. User signs in using Firebase-based authentication.
2. User creates or updates a resume profile.
3. User practices interview sessions with AI assistance.
4. The platform evaluates responses and generates analytics.
5. User generates a customized roadmap based on goals and salary target.
6. User can access premium features and billing options when needed.

## Project Structure

```text
fresherAI/
├── backend/
│   ├── gateway/
│   ├── services/
│   ├── shared/
│   ├── docker-compose.yml
│   ├── package.json
│   └── .dockerignore
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── .gitignore
├── README.md
├── professional.md
└── deployment.txt
```

## Environment Configuration

The project relies heavily on environment variables for service connectivity and secrets.

Typical configuration includes:

- backend gateway URL and service URLs
- MongoDB connection strings
- Redis URL
- Firebase configuration values
- Razorpay keys
- AI provider API keys
- frontend backend URL

Important: never commit `.env` files to GitHub. Keep all secrets secure.

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- Docker Desktop
- MongoDB
- Firebase project
- Razorpay account
- Required AI API keys

### 1. Clone the project

```bash
git clone <repository-url>
cd fresherAI
```

### 2. Start Redis

```bash
cd backend
docker compose up -d
```

### 3. Install backend dependencies

Run each backend service in a separate terminal:

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

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev -- --host
```

Open the application in the browser:

```text
http://localhost:5173
```

## Default Service Ports

- Gateway: http://localhost:6000
- Auth Service: http://localhost:6001
- Resume Service: http://localhost:6002
- Interview Service: http://localhost:6003
- Roadmap Service: http://localhost:6004
- Billing Service: http://localhost:6005

## Deployment Notes

The project includes Docker-related setup files for containerized deployment. The backend is designed to run as multiple independent services, which makes it easier to deploy on cloud platforms such as AWS, Railway, Render, or Docker-based orchestration environments.

## Benefits of FresherAI

- Helps freshers prepare for job interviews with AI support
- Reduces uncertainty in career planning
- Creates a clearer path from resume creation to internship/job readiness
- Improves interview confidence through structured practice
- Gives actionable insights to help users improve faster
- Merges multiple career tools into one unified platform

## Future Enhancements

Potential future improvements include:

- advanced AI interview scoring models
- multi-language support
- recruiter dashboards
- more detailed roadmap personalization
- premium analytics reports
- exportable resume templates
- improved team and admin management

## License

This project is intended for educational and demonstration purposes. Please check the repository license before public distribution or commercial use.
