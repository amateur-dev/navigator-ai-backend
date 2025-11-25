# Vultr PDF Extraction Service

AI-powered medical document extraction using **pdf-parse** + **CEREBRAS AI**.

## 🏗️ Architecture

```
PDF File → pdf-parse (text extraction) → CEREBRAS AI (intelligent parsing) → Structured JSON
```

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your CEREBRAS_API_KEY

# Start server
npm start

# Or with auto-reload
npm run dev
```

Server runs on `http://localhost:3001`

### Test Extraction

```bash
curl -X POST http://localhost:3001/extract \
  -F "file=@/path/to/medical-referral.pdf"
```

## 📦 Deployment to Vultr

### Prerequisites
1. Vultr server (Ubuntu 22.04 recommended)
2. SSH access configured
3. CEREBRAS API key

### Deploy

```bash
# Set environment variables
export VULTR_SERVER_IP="your.server.ip.address"
export CEREBRAS_API_KEY="csk-your-api-key"

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

The script will:
- Install Node.js (if needed)
- Copy files to server
- Install dependencies
- Setup PM2 for process management
- Start the service

### Manual Deployment

```bash
# SSH into your Vultr server
ssh root@your-server-ip

# Clone or upload the code
mkdir -p /opt/extraction-service
cd /opt/extraction-service

# Install Node.js 18+ (if needed)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install dependencies
npm install

# Create .env file
nano .env
# Add: CEREBRAS_API_KEY=your-key-here

# Install PM2
npm install -g pm2

# Start service
pm2 start server.js --name extraction-service
pm2 save
pm2 startup
```

## 📡 API Endpoints

### `GET /health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "service": "vultr-extraction"
}
```

### `POST /extract`
Extract patient data from medical referral PDF

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (PDF file)

**Response:**
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
    "filename": "referral.pdf",
    "fileSize": 82144,
    "textLength": 1523,
    "extractedAt": "2025-11-25T01:30:44.123Z"
  }
}
```

## 🔧 Management Commands

```bash
# View logs
pm2 logs extraction-service

# Restart service
pm2 restart extraction-service

# Stop service
pm2 stop extraction-service

# Check status
pm2 status
```

## 🧪 Testing

```bash
# Test with sample PDF
curl -X POST http://your-server-ip:3001/extract \
  -F "file=@Medical_Referral_Document_2.pdf" \
  | jq .
```

## 🛡️ Security Notes

- The service accepts PDFs up to 10MB
- CORS is enabled for all origins (configure in production)
- API key is read from environment variables
- No file storage - processes in memory

## 🌐 Integration with Frontend

Update your frontend to call Vultr for extraction:

```javascript
const formData = new FormData();
formData.append('file', pdfFile);

const response = await fetch('http://your-vultr-ip:3001/extract', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.data); // Extracted patient info
```

## 🎯 Tech Stack

- **Express.js** - Web framework
- **pdf-parse** - PDF text extraction
- **CEREBRAS SDK** - AI-powered parsing
- **Multer** - File upload handling
- **PM2** - Process management

## 📊 Performance

- Average extraction time: 2-4 seconds
- Concurrent requests: Handles multiple PDFs simultaneously
- Memory usage: ~100MB per process
