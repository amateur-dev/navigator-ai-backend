# 🚀 Vultr Extraction Service - Quick Deploy Guide

## ✅ What You Have

A standalone PDF extraction service that:
- Uses **pdf-parse** to extract text from PDFs
- Uses **CEREBRAS AI** (llama3.1-8b) for intelligent parsing
- Returns structured medical data

## 📋 Prerequisites

1. **Vultr Server** 
   - Ubuntu 22.04 (recommended)
   - Minimum: 1GB RAM, 1 CPU
   - Plan: `vc2-1c-1gb` ($6/month)

2. **CEREBRAS API Key**
   - You have: `csk-k2xkk65hrwn46ypvhepyf49mhjx4f2hc3k6ywxcrhkt6ttvt`

3. **SSH Access** to your Vultr server

---

## 🎯 Option 1: Automated Deployment (15 minutes)

### Step 1: Create Vultr Server
```bash
# Using Vultr API (if you have API key)
curl "https://api.vultr.com/v2/instances" \
  -X POST \
  -H "Authorization: Bearer $VULTR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "region": "sgp",
    "plan": "vc2-1c-1gb",
    "label": "extraction-service",
    "os_id": 1743
  }'

# OR manually via Vultr Dashboard
# https://my.vultr.com/deploy/
#  - Region: Singapore
#  - Plan: High Frequency $6/month
#  - OS: Ubuntu 22.04
```

### Step 2: Deploy Service
```bash
# From your local machine
cd navigator-ai-backend/vultr-extraction-service

# Set your Vultr server IP
export VULTR_SERVER_IP="YOUR_SERVER_IP_HERE"
export CEREBRAS_API_KEY="csk-k2xkk65hrwn46ypvhepyf49mhjx4f2hc3k6ywxcrhkt6ttvt"

# Run deployment script
./deploy.sh
```

**That's it!** The service will be running on `http://YOUR_SERVER_IP:3001`

---

## 🎯 Option 2: Manual Deployment (if script fails)

### Step 1: SSH into Vultr
```bash
ssh root@YOUR_SERVER_IP
```

### Step 2: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs git
```

### Step 3: Clone and Setup
```bash
# Create directory
mkdir -p /opt/extraction-service
cd /opt/extraction-service

# Option A: Clone from GitHub
git clone https://github.com/amateur-dev/navigator-ai-backend.git .
cd vultr-extraction-service

# Option B: Or upload files manually
# (Use scp from local machine)

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
CEREBRAS_API_KEY=csk-k2xkk65hrwn46ypvhepyf49mhjx4f2hc3k6ywxcrhkt6ttvt
PORT=3001
EOF
```

### Step 4: Install PM2 and Start
```bash
npm install -g pm2
pm2 start server.js --name extraction-service
pm2 save
pm2 startup
```

### Step 5: Configure Firewall
```bash
# Allow port 3001
ufw allow 3001/tcp
ufw status
```

---

## ✅ Verify Installation

```bash
# Health check
curl http://YOUR_SERVER_IP:3001/health

# Should return:
# {"status":"healthy","service":"vultr-extraction"}
```

---

## 🧪 Test Extraction

### From Your Local Machine:
```bash
cd navigator-ai-backend/backend

# Test with Document 2
curl -X POST http://YOUR_SERVER_IP:3001/extract \
  -F "file=@Medical Referral Document 2.pdf" \
  | jq .
```

### Expected Response:
```json
{
  "success": true,
  "data": {
    "patientName": "Aisha Patel",
    "dateOfBirth": "1985-07-22",
    "referralReason": "Chronic right knee pain, suspected meniscal tear",
    "insuranceProvider": "United Healthcare HMO"
  },
  "metadata": {
    "filename": "Medical Referral Document 2.pdf",
    "fileSize": 82144,
    "textLength": 1523,
    "extractedAt": "2025-11-25T01:30:44.123Z"
  }
}
```

---

## 🔧 Management

```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# View logs
pm2 logs extraction-service

# Restart service
pm2 restart extraction-service

# Stop service
pm2 stop extraction-service

# Check status
pm2 status
```

---

## 🌐 Update Frontend Integration

Change your frontend to call Vultr instead of Raindrop:

### Before (Raindrop):
```javascript
const response = await fetch('https://raindrop-url/extract', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: documentId })
});
```

### After (Vultr):
```javascript
const formData = new FormData();
formData.append('file', pdfFile);

const response = await fetch('http://YOUR_VULTR_IP:3001/extract', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.data); // { patientName, dateOfBirth, ... }
```

---

## 🎉 You're Done!

Your AI-powered extraction service is running on Vultr with:
- ✅ Real PDF parsing (pdf-parse)
- ✅ CEREBRAS AI intelligence
- ✅ Fast, reliable extraction

**Service URL**: `http://YOUR_SERVER_IP:3001`

---

## 🆘 Troubleshooting

### Service won't start
```bash
# Check logs
pm2 logs extraction-service

# Check if port is in use
netstat -tulpn | grep 3001

# Restart
pm2 restart extraction-service
```

### Can't connect from frontend
```bash
# Check firewall
ufw status

# Allow port 3001
ufw allow 3001/tcp
```

### Dependencies fail to install
```bash
# Update npm
npm install -g npm@latest

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```
