# Vultr Deployment Guide

## Prerequisites
- Vultr Account
- Vultr API Key (Enable in Account Settings > API)
- `curl` installed

## Deployment Steps

1. **Export API Key**
   ```bash
   export VULTR_API_KEY="your-vultr-api-key"
   ```

2. **Run Deployment Script**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Manual Steps (Post-Provisioning)**
   - The script will provision a server (Ubuntu 22.04).
   - SSH into the server IP (found in Vultr Dashboard or script output if enhanced).
   - Clone the repo:
     ```bash
     git clone <your-repo-url>
     cd navigator-ai-backend/backend
     npm install
     npm run build
     npm start
     ```

## Infrastructure Details
- **Plan**: vc2-1c-1gb (High Frequency Compute)
- **Region**: Singapore (sgp) - Change in `deploy.sh` if needed.
- **OS**: Ubuntu 22.04 LTS
