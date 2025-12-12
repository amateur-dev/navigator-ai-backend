# Navigator-AI Hackathon MVP

## Overview

Navigator-AI MVP automates the healthcare referral workflow, from document upload and AI-based extraction to patient appointment orchestration. This project is built for the hackathon, integrating Raindrop for workflow orchestration, smart components, and AI, while deploying the final working backend to Vultr cloud platform for demo qualification.

The project uses a mono-repo setup with separate directories for frontend and backend components.

## Architecture

- **Mono-Repo Structure:**
  - `/frontend`: Next.js-based UI for referral document upload, workflow status dashboard, and results display.
  - `/backend`: Node.js API server leveraging Raindrop for document handling, AI extraction, workflow orchestration, storage, and messaging.
  - `/vultr-extraction-service`: Standalone extraction service deployed on Vultr for additional processing.

- **Integration Points:** Frontend communicates with backend via OpenAPI-documented RESTful endpoints.
- **Platform Usage:**
  - Raindrop powers backend logic: SmartSQL for data management, SmartMemory for state, object buckets for storage, and AI for extraction.
  - Vultr provides cloud infrastructure: VM/container deployment, storage, database, and hosting.

## Key Features

### Frontend (`/frontend`)
- Referral document upload form
- Real-time workflow status dashboard
- Results and confirmation display

### Backend (`/backend`)
- RESTful API endpoints for upload, extraction, orchestration, and confirmation
- Raindrop-managed AI extraction from uploaded documents
- Workflow orchestration for appointment scheduling
- Messaging integration for confirmations
- OpenAPI specification for frontend integration

### Vultr Integration
- Provision VM/container via Vultr CLI/API
- Deploy backend and extraction services on Vultr instances
- Use Vultr Block/Object Storage for data persistence
- Host static frontend on Vultr for complete demo

## MVP Scope
- End-to-end referral workflow: upload → AI parse → schedule → confirm
- Thorough local testing before cloud deployment
- Documented Vultr deployment steps for reproducibility
- Demo qualification by running live on Vultr

## Setup and Installation

### Prerequisites
- Node.js (v18+)
- pnpm package manager
- Raindrop CLI/SDK configured
- Vultr account and CLI/API access

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/amateur-dev/navigator-ai-backend.git
   cd navigator-ai-backend
   ```

2. Install dependencies for all components:
   ```bash
   pnpm install
   ```

3. Setup backend:
   ```bash
   cd backend
   pnpm install
   ```

4. Setup frontend:
   ```bash
   cd frontend
   pnpm install
   ```

## Running Locally

### Backend
```bash
cd backend
pnpm start
```
Server runs on `http://localhost:3000`

### Frontend
```bash
cd frontend
pnpm dev
```
App runs on `http://localhost:3000` (or configured port)

### Testing
- Backend tests: `cd backend && pnpm test`
- End-to-end tests: `cd backend && node test-e2e.mjs`

## API Documentation

See `backend/README.md` for detailed API endpoint documentation.

## Deployment to Vultr

For hackathon demo qualification, deploy the backend to Vultr:

1. Follow the deployment guide: `backend/VULTR_DEPLOY.md`
2. Use Vultr CLI/API to provision infrastructure
3. Deploy services using the provided scripts
4. Verify live demo on Vultr instance

## Project Structure

```
navigator-ai-backend/
├── backend/                 # Node.js API server
│   ├── src/
│   ├── package.json
│   ├── README.md
│   └── VULTR_DEPLOY.md
├── frontend/                # Next.js UI
│   ├── app/
│   ├── components/
│   └── package.json
├── vultr-extraction-service/ # Vultr-deployed extraction service
├── prd.md                   # Product Requirements Document
├── QUICK_TEST_GUIDE.md      # Testing guide
└── README.md                # This file
```

## Contributing

1. Follow the mono-repo structure
2. Test locally before committing
3. Update documentation as needed
4. Use Raindrop for backend logic and Vultr for deployment

## License

This project is for hackathon demonstration purposes.

## References

- [Raindrop Guide](raindrop-guide.md)
- [Vultr Deployment Reference](vultr-github-copilot-reference.md)
- [Product Requirements](prd.md)