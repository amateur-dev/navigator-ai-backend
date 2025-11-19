# Navigator-AI Backend Walkthrough

## Overview
This backend service powers the Navigator-AI hackathon MVP. It integrates Raindrop for orchestration and AI, and is ready for deployment on Vultr.

## Features Implemented
- **Healthcheck**: `/ping` endpoint for uptime monitoring.
- **File Upload**: `/upload` endpoint using Raindrop SDK (mocked for local dev).
- **AI Extraction**: `/extract` endpoint to parse patient data (mocked).
- **Orchestration**: `/orchestrate` endpoint to determine specialist and schedule (mocked SmartSQL).
- **Confirmation**: `/confirm` endpoint for patient communication (mocked).

## Verification
All endpoints have been verified with Jest tests.
Run tests with:
```bash
cd backend
npm test
```

## Deployment
The backend is ready to be deployed to Vultr.
See [VULTR_DEPLOY.md](file:///Users/dk_sukhani/code/navigator-ai-backend/backend/VULTR_DEPLOY.md) for instructions.
Run the deployment script:
```bash
cd backend
./deploy.sh
```

## Project Structure
- `backend/src/server.ts`: Main Express application.
- `backend/src/server.test.ts`: Jest tests.
- `backend/raindrop.manifest`: Raindrop infrastructure definition.
- `backend/deploy.sh`: Vultr provisioning script.
