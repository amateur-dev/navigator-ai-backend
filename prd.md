# PRD: Navigator-AI Hackathon MVP (Raindrop + Vultr)

## Product Overview
Navigator-AI MVP automates the healthcare referral workflow, from document upload and AI-based extraction to patient appointment orchestration. The project uses a mono-repo setup with separate baskets for frontend and backend. Backend leverages Raindrop for workflow orchestration, smart components, and AI, and deploys the final working backend to Vultr cloud platform for hackathon demo qualification.

## Architecture Overview
- **Mono-Repo Structure:**
  - `/frontend`: UI/upload & workflow by colleague.
  - `/backend`: API, workflow, Raindrop services, and Vultr deployment.
- **Integration Points:** Frontend communicates with backend via OpenAPI-documented endpoints.
- **Platform Usage:**
  - Raindrop powers backend logic: document handling, extraction, workflow, storage, messaging.
  - Vultr used for cloud infrastructure: instance deployment, storage, database, network, and external API hosting.

## Goals
- Deliver MVP with both Raindrop (logic, orchestration) and Vultr (deployment) integration.
- Demo end-to-end flow for judges: referral upload, AI parse, schedule, confirm—running on Vultr.

## Users and Stakeholders
- **Judges/Peers:** Evaluate workflow, use of both platforms, and working cloud deployment.
- **Demo Coordinator/Patient:** Demo real referral-to-confirmation flow.
- **Developers:** Collaborate via mono-repo.

## Key Features

### Frontend (`/frontend`)
- Referral upload form.
- Workflow/status dashboard.
- Results display.

### Backend (`/backend`)
- Raindrop-managed endpoints and AI extraction.
- SmartSQL, SmartMemory, object bucket via Raindrop CLI/SDK.
- RESTful API for upload, status, orchestration, and messaging.
- API OpenAPI spec for frontend integration.
- **Vultr Integration (Final Step):**
  - Provision VM/container via Vultr CLI/API.
  - Deploy backend on Vultr instance or managed K8s.
  - Use Vultr Block/Object Storage if demo data exceeds Raindrop quota.
  - Optionally, host static frontend on Vultr for complete demo.
  - Reference Vultr commands from included docs for CLI/API usage.

## MVP Scope
- All backend logic is implemented and thoroughly tested locally before Vultr deployment.
- Once MVP is stable: use Vultr CLI/API (as per shared reference) to provision infrastructure, and deploy backend service.
- Document Vultr deployment steps in `README.md` for reproducibility.
- Qualify hackathon by demonstrating backend live on Vultr.

## KPIs
- Complete working workflow on Vultr cloud for demo.
- Functional integration: Raindrop for logic, Vultr for infra.
- Judges can see both platform usages in architecture and demo.

## Constraints & Considerations
- Vultr account may not be available early; prep deploy scripts and document steps for later.
- Use mock data if Raindrop storage/resources exceed quotas.
- Deployment only switches to Vultr once backend is working and tests pass.
- Minimal UI and infra for rapid hackathon delivery.

## Example User Stories
- As a coordinator, I upload a referral and see full workflow status via frontend, orchestrated by Raindrop.
- As a judge, I see the backend deployed and live on Vultr, with visible Raindrop features powering the workflow.
- As a developer, I can run, test, and deploy the backend through documented, incremental steps.

## Timeline
- **Day 1:** Repo setup (`/frontend`, `/backend`), API contract, Raindrop CLI testing.
- **Days 2-5:** Backend incremental build using Raindrop, stepwise testing, commit after each success.
- **Day 5-6:** Vultr deployment prep/script, backend provisioning on Vultr with CLI/API, infra documentation.
- **Day 7:** Final tests, bug fix, presentation polish, live demo from Vultr.

## Integration & Deployment
- Backend endpoints exposed clearly for frontend use.
- Vultr infrastructure provisioned as final hackathon step.
- README and comments reference both `raindrop-guide.md` and Vultr deployment commands/docs for repeatability.