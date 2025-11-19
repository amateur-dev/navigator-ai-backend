#!/bin/bash

# Vultr Deployment Script
# Usage: ./deploy.sh

if [ -z "$VULTR_API_KEY" ]; then
  echo "Error: VULTR_API_KEY environment variable is not set."
  echo "Please export your API key: export VULTR_API_KEY='your-key'"
  exit 1
fi

echo "Provisioning Vultr Instance..."

# Create Instance (Example: vc2-1c-1gb in sgp)
# Reference: vultr-github-copilot-reference.md
RESPONSE=$(curl -s "https://api.vultr.com/v2/instances" \
  -X POST \
  -H "Authorization: Bearer $VULTR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{
    "region": "sgp",
    "plan": "vc2-1c-1gb",
    "os_id": 1743, 
    "label": "navigator-ai-backend",
    "hostname": "navigator-ai-backend"
  }')

INSTANCE_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$INSTANCE_ID" ]; then
  echo "Error: Failed to create instance."
  echo "Response: $RESPONSE"
  exit 1
fi

echo "Instance created with ID: $INSTANCE_ID"
echo "Waiting for instance to be ready..."

# In a real scenario, we would loop and check status, then SSH to deploy.
# For MVP/Hackathon, we print the next steps.

echo "Deployment initiated. Once the instance is active, SSH into it and run:"
echo "  git clone https://github.com/your-repo/navigator-ai-backend.git"
echo "  cd navigator-ai-backend/backend"
echo "  npm install"
echo "  npm start"

echo "Done."
