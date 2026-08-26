- upadat auth env
- update serviceAccountkey.json in auth . from Fire base.
- update billing env
- update interview env
- update resume env
- update roadmap env
- update frontend env
- update firebaseConfig  in frontend/src/utlis/firebase 


---------  RUN SETPUT ---
- `cd backend`
- open docker destop app
- `docker compose up`
- new terminal inside  gateway
- `npm run dev`
- new terminal inside services and auth
- `npm run dev`
- new terminal inside services and biling
- `npm run dev`
- new terminal inside services and interview
- `npm run dev`
- new terminal inside services and resume
- `npm run dev`
- new terminal inside services and roadmap
- `npm run dev`
- new terminal inside frontend 
- `npm run dev`

---------------------------- DEPLOYMENT (image create docker) -----------
- Docker image build
- inside backend folder 
- `docker build -f ./gateway/Dockerfile -t gateway .`
- opem cmd 
- `docker run -it -p 8000:8000 gateway`
- `docker build -f ./services/auth/Dockerfile -t auth-service .`
- opem cmd close older 
- `docker run -it -p 8000:8000 auth-service`
- `docker build -f ./services/billing/Dockerfile -t billing-service .`
- opem cmd close older 
- `docker run -it -p 8000:8000 billing-service`
- `docker build -f ./services/interview/Dockerfile -t interview-service .`
- opem cmd close older 
- `docker run -it -p 8000:8000 interview-service`

- `docker build -f ./services/resume/Dockerfile -t resume-service .`
- opem cmd close older 
- `docker run -it -p 8000:8000 resume-service`

- `docker build -f ./services/roadmap/Dockerfile -t roadmap-service .`
- opem cmd close older 
- `docker run -it -p 8000:8000 roadmap-service`

-------------  ECR PUSH DONE -----

------  


