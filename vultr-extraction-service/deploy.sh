#!/bin/bash

# Vultr PDF Extraction Service Deployment Script
# This script deploys the service to a Vultr server

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   Vultr PDF Extraction Service Deployment               ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check for required environment variables
if [ -z "$VULTR_SERVER_IP" ]; then
    echo "❌ Error: VULTR_SERVER_IP environment variable not set"
    echo "   Example: export VULTR_SERVER_IP=123.45.67.89"
    exit 1
fi

if [ -z "$CEREBRAS_API_KEY" ]; then
    echo "❌ Error: CEREBRAS_API_KEY environment variable not set"
    echo "   Example: export CEREBRAS_API_KEY=csk-..."
    exit 1
fi

SERVER_IP=$VULTR_SERVER_IP
SSH_USER=${VULTR_SSH_USER:-root}
APP_DIR="/opt/extraction-service"

echo "📋 Deployment Configuration:"
echo "   Server: $SERVER_IP"
echo "   User: $SSH_USER"
echo "   App Directory: $APP_DIR"
echo ""

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf deployment.tar.gz package.json server.js .env.example
echo "✅ Package created"

# Copy files to server
echo "📤 Uploading to Vultr server..."
scp deployment.tar.gz $SSH_USER@$SERVER_IP:/tmp/
echo "✅ Files uploaded"

# SSH and setup
echo "🔧 Setting up environment on Vultr..."
ssh $SSH_USER@$SERVER_IP << EOF
set -e

# Create app directory
mkdir -p $APP_DIR
cd $APP_DIR

# Extract files
tar -xzf /tmp/deployment.tar.gz
rm /tmp/deployment.tar.gz

# Create .env file
cat > .env << ENVFILE
CEREBRAS_API_KEY=$CEREBRAS_API_KEY
PORT=3001
ENVFILE

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup PM2 for process management
if ! command -v pm2 &> /dev/null; then
    echo "📥 Installing PM2..."
    npm install -g pm2
fi

# Start/Restart service
echo "🚀 Starting service..."
pm2 stop extraction-service 2>/dev/null || true
pm2 start server.js --name extraction-service
pm2 save

# Setup PM2 startup
pm2 startup systemd -u $SSH_USER --hp /root 2>/dev/null || true

echo "✅ Service deployed and running!"
EOF

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║   ✅ Deployment Complete!                                ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Service URL: http://$SERVER_IP:3001"
echo "📊 Health Check: http://$SERVER_IP:3001/health"
echo ""
echo "Useful commands:"
echo "  ssh $SSH_USER@$SERVER_IP 'pm2 logs extraction-service'"
echo "  ssh $SSH_USER@$SERVER_IP 'pm2 status'"
echo "  ssh $SSH_USER@$SERVER_IP 'pm2 restart extraction-service'"
echo ""

# Cleanup
rm deployment.tar.gz

# Test health check
echo "🏥 Testing health endpoint..."
sleep 2
curl -s http://$SERVER_IP:3001/health | jq . || echo "Note: Install jq for pretty output"
