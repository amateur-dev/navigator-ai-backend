# Local Setup Guide for Frontend Development

> **Quick Start:** Get the extraction service running locally to test with your frontend

---

## 📋 Prerequisites

Before you start, make sure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ Access to this repository
- ✅ A terminal/command prompt open

---

## 🚀 Step-by-Step Setup (5 minutes)

### Step 1: Navigate to Extraction Service

```bash
# From the repository root
cd navigator-ai-backend/vultr-extraction-service
```

### Step 2: Install Dependencies

```bash
npm install
```

You should see:
```
added 115 packages in 5s
```

### Step 3: Verify Environment File

```bash
# Check if .env file exists
cat .env
```

You should see:
```
CEREBRAS_API_KEY=csk-k2xkk65hrwn46ypvhepyf49mhjx4f2hc3k6ywxcrhkt6ttvt
PORT=3001
```

✅ If you see this, you're good!  
❌ If file doesn't exist, create it:

```bash
cat > .env << EOF
CEREBRAS_API_KEY=csk-k2xkk65hrwn46ypvhepyf49mhjx4f2hc3k6ywxcrhkt6ttvt
PORT=3001
EOF
```

### Step 4: Start the Extraction Service

```bash
npm start
```

**You should see:**
```
╔══════════════════════════════════════════════════════════╗
║   🚀 Vultr PDF Extraction Service                        ║
╚══════════════════════════════════════════════════════════╝

📍 Server running on: http://0.0.0.0:3001
🤖 AI Engine: CEREBRAS (llama3.1-8b)
📄 PDF Parser: pdf-parse
✅ Ready to extract medical referrals!

Endpoints:
  GET  /health  - Health check
  POST /extract - Extract patient data from PDF
```

🎉 **Success!** The extraction service is now running!

---

## ✅ Test It Works

Open a **NEW terminal window** (keep the first one running) and test:

```bash
# Test health endpoint
curl http://localhost:3001/health

# Should return:
# {"status":"healthy","service":"vultr-extraction"}
```

### Test with a Real PDF

```bash
# Navigate to backend folder
cd navigator-ai-backend/backend

# Test extraction
curl -X POST http://localhost:3001/extract \
  -F "file=@Medical Referral Document 2.pdf"
```

**Expected Response:**
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
    "fileSize": 80859,
    "textLength": 1874,
    "extractedAt": "2025-11-25T01:36:58.132Z"
  }
}
```

✅ If you see this, extraction is working!

---

## 🎨 Now Start Your Frontend

With the extraction service running (Terminal 1), open a **new terminal** for your frontend:

```bash
# Terminal 2
cd ../frontend  # or wherever your frontend is

# Start your frontend dev server
npm run dev
# or
npm start
```

Now your frontend can call:
```javascript
fetch('http://localhost:3001/extract', {...})
```

---

## 🔧 Developer Workflow

### Daily Workflow

**Terminal 1: Backend Extraction Service**
```bash
cd navigator-ai-backend/vultr-extraction-service
npm start
# Leave this running
```

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
# Leave this running
```

Both services run simultaneously!

---

## 🛑 Stopping Services

### Stop Extraction Service
In Terminal 1, press: `Ctrl + C`

### Stop Frontend
In Terminal 2, press: `Ctrl + C`

---

## 🧪 Testing from Frontend Code

### Basic Test

```javascript
// Test extraction endpoint
const testExtraction = async () => {
  const response = await fetch('http://localhost:3001/health');
  const data = await response.json();
  console.log('Extraction service:', data);
  // Should log: { status: 'healthy', service: 'vultr-extraction' }
};

testExtraction();
```

### Upload PDF from Frontend

```html
<!-- In your React/HTML -->
<input 
  type="file" 
  accept=".pdf" 
  onChange={handleFileUpload} 
/>
```

```javascript
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  
  if (!file) return;
  
  console.log('Uploading:', file.name);
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('http://localhost:3001/extract', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Patient data:', result.data);
      // Use result.data in your UI
    } else {
      console.error('❌ Extraction failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};
```

---

## 📊 What's Running Where?

| Service | URL | Terminal | Status |
|---------|-----|----------|--------|
| Extraction Service | `http://localhost:3001` | Terminal 1 | Keep running |
| Your Frontend | `http://localhost:3000` (or 3000+) | Terminal 2 | Keep running |
| Raindrop Backend | Cloud (always running) | N/A | Already deployed |

---

## 🆘 Troubleshooting

### "Port 3001 already in use"

Someone else is using port 3001. Either:

**Option 1: Kill the process**
```bash
# macOS/Linux
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Option 2: Use different port**
```bash
# Edit .env file
PORT=3002

# Restart service
npm start

# Update frontend to use :3002
```

### "CEREBRAS_API_KEY missing"

```bash
# Create .env file
cat > .env << EOF
CEREBRAS_API_KEY=csk-k2xkk65hrwn46ypvhepyf49mhjx4f2hc3k6ywxcrhkt6ttvt
PORT=3001
EOF

# Restart
npm start
```

### "npm: command not found"

Install Node.js:
- Visit: https://nodejs.org/
- Download LTS version
- Install and restart terminal

### CORS Errors

The extraction service already has CORS enabled. If you still see errors:

```javascript
// Make sure you're using the correct URL
fetch('http://localhost:3001/extract', {...})
//     ^-- include http://
```

### Extraction returns empty data

- ✅ Check PDF has selectable text (not scanned image)
- ✅ Check extraction service logs in Terminal 1
- ✅ Try with the sample PDFs in `backend/` folder first

---

## 📝 Quick Reference

### Start Everything
```bash
# Terminal 1
cd navigator-ai-backend/vultr-extraction-service && npm start

# Terminal 2  
cd frontend && npm run dev
```

### Test Extraction Works
```bash
curl http://localhost:3001/health
```

### View Logs
Terminal 1 shows extraction service logs in real-time

---

## 🎯 Next Steps

Once extraction service is running:

1. ✅ Read the main [Frontend Integration Guide](FRONTEND_INTEGRATION.md)
2. ✅ Implement PDF upload in your frontend
3. ✅ Call `/extract` endpoint
4. ✅ Display extracted patient data
5. ✅ Call Raindrop `/orchestrate` and `/confirm`

---

## 💡 Pro Tips

- Keep extraction service running all day while developing
- Check Terminal 1 logs if extraction fails
- Use the sample PDFs in `backend/` for testing
- CORS is already enabled - no config needed

---

## ✅ Checklist

Before you start frontend development:

- [ ] Node.js 18+ installed
- [ ] Extraction service dependencies installed (`npm install`)
- [ ] `.env` file exists with CEREBRAS API key
- [ ] Extraction service starts successfully (`npm start`)
- [ ] Health check works (`curl http://localhost:3001/health`)
- [ ] Test extraction works with sample PDF
- [ ] Read Frontend Integration Guide

---

Happy coding! 🚀

**Need help?** Check the main [Frontend Integration Guide](FRONTEND_INTEGRATION.md) or the server logs in Terminal 1.
