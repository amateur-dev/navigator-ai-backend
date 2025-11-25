# Frontend Integration Guide - Complete Flow

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│                    (Your React/Next App)                    │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             │ ① PDF Upload               │ ②③④ Orchestration
             ▼                            ▼
┌─────────────────────────┐   ┌──────────────────────────────┐
│  LOCAL EXTRACTION       │   │     RAINDROP BACKEND         │
│  SERVICE                │   │                              │
│  Port: 3001             │   │  (Live Deployment)           │
├─────────────────────────┤   ├──────────────────────────────┤
│ • pdf-parse             │   │ • Doctor Database (SmartSQL) │
│ • CEREBRAS AI (parsing) │   │ • File Storage (SmartBucket) │
│ • POST /extract         │   │ • POST /orchestrate          │
│                         │   │ • POST /confirm              │
└─────────────────────────┘   └──────────────────────────────┘
         │                              │
         │ AI Processing                │ Data Management
         ▼                              ▼
┌─────────────────────────┐   ┌──────────────────────────────┐
│  CEREBRAS CLOUD         │   │   RAINDROP SMART SERVICES    │
│  (AI Intelligence)      │   │                              │
├─────────────────────────┤   ├──────────────────────────────┤
│ • llama3.1-8b model     │   │ • SmartSQL (doctor queries)  │
│ • Medical text parsing  │   │ • SmartBucket (PDF storage)  │
│ • Data structuring      │   │ • Database operations        │
└─────────────────────────┘   └──────────────────────────────┘
```

## 📍 Service Locations

### Local Development (Current Setup)

| Service | URL | Purpose |
|---------|-----|---------|
| **Extraction Service** | `http://localhost:3001` | PDF → AI Extraction |
| **Raindrop Backend** | `https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run` | Orchestration, DB, Storage |

---

## 🔄 Complete Workflow

### Step-by-Step Flow

```
User Uploads PDF
       ↓
① POST /extract (LOCAL:3001)
   - Extracts text from PDF
   - CEREBRAS AI parses data
   - Returns structured patient info
       ↓
② POST /orchestrate (RAINDROP)
   - Finds matching specialist
   - Queries doctor database
   - Checks insurance
   - Returns doctor + appointment slots
       ↓
③ POST /confirm (RAINDROP)  
   - Generates confirmation messages
   - Returns SMS & Email previews
       ↓
Display Confirmation to User
```

---

## 📡 API Endpoints - Complete Reference

### **① PDF EXTRACTION** (Local Service)

**Endpoint:** `POST http://localhost:3001/extract`

**Location:** Local extraction service (port 3001)

**AI Used:** CEREBRAS (llama3.1-8b) for intelligent parsing

**Request:**
```http
POST http://localhost:3001/extract
Content-Type: multipart/form-data

file: <PDF file>
```

**JavaScript Example:**
```javascript
const formData = new FormData();
formData.append('file', pdfFile); // File from <input type="file">

const response = await fetch('http://localhost:3001/extract', {
  method: 'POST',
  body: formData
});

const result = await response.json();
```

**Response (Success - 200):**
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

**Response (Error - 400/500):**
```json
{
  "error": "Failed to parse PDF",
  "details": "Error message details"
}
```

**Where data goes:**
- PDF file → pdf-parse (converts PDF to text)
- Extracted text → CEREBRAS AI (structures into JSON)

---

### **② FIND SPECIALIST & SCHEDULE** (Raindrop)

**Endpoint:** `POST https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run/orchestrate`

**Location:** Raindrop Cloud

**Database Used:** Raindrop SmartSQL (doctor database with 50+ specialists)

**Request:**
```http
POST https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run/orchestrate
Content-Type: application/json

{
  "patientName": "Aisha Patel",
  "referralReason": "Chronic right knee pain, suspected meniscal tear",
  "insuranceProvider": "United Healthcare HMO"
}
```

**JavaScript Example:**
```javascript
const orchestrateResponse = await fetch(
  'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run/orchestrate',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientName: extractedData.patientName,
      referralReason: extractedData.referralReason,
      insuranceProvider: extractedData.insuranceProvider
    })
  }
);

const doctorMatch = await orchestrateResponse.json();
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "referralId": "ref-15",
    "status": "Processed",
    "specialist": "Orthopedic Surgeon",
    "assignedDoctor": "Dr. Sarah Chen",
    "insuranceStatus": "Approved",
    "availableSlots": [
      "2025-11-26T14:00:00.000Z",
      "2025-11-27T10:00:00.000Z",
      "2025-11-28T15:30:00.000Z"
    ],
    "doctorInfo": {
      "name": "Dr. Sarah Chen",
      "specialty": "Orthopedic Surgeon",
      "facility": "Metro Orthopedic Center",
      "address": "456 Medical Plaza, New York, NY 10002"
    }
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required fields",
    "statusCode": 400
  }
}
```

**What happens:**
1. Raindrop searches doctor database by specialty keywords
2. Matches "knee pain" → Orthopedic Surgeon
3. Finds available doctors
4. Returns doctor + appointment slots

---

### **③ GENERATE CONFIRMATION** (Raindrop)

**Endpoint:** `POST https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run/confirm`

**Location:** Raindrop Cloud

**Request:**
```http
POST https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run/confirm
Content-Type: application/json

{
  "referralId": "ref-15",
  "patientName": "Aisha Patel",
  "patientEmail": "aisha.patel@email.com",
  "patientPhone": "+1-555-0123",
  "doctorName": "Dr. Sarah Chen",
  "specialty": "Orthopedic Surgeon",
  "appointmentDate": "2025-11-26",
  "appointmentTime": "2:00 PM"
}
```

**JavaScript Example:**
```javascript
const confirmResponse = await fetch(
  'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run/confirm',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      referralId: doctorMatch.data.referralId,
      patientName: extractedData.patientName,
      patientEmail: 'aisha.patel@email.com',
      patientPhone: '+1-555-0123',
      doctorName: doctorMatch.data.assignedDoctor,
      specialty: doctorMatch.data.specialist,
      appointmentDate: '2025-11-26',
      appointmentTime: '2:00 PM'
    })
  }
);

const confirmation = await confirmResponse.json();
```

**Response (Success - 200):**
```json
{
  "success": true,
  "confirmationSent": true,
  "referralId": "ref-15",
  "notifications": {
    "sms": {
      "to": "+1-555-0123",
      "message": "Hi Aisha! Your Orthopedic Surgeon appointment with Dr. Sarah Chen is confirmed for Nov 26 at 2:00 PM at Metro Orthopedic Center...",
      "length": 245,
      "estimatedCost": "$0.0075"
    },
    "email": {
      "to": "aisha.patel@email.com",
      "subject": "Appointment Confirmed - Dr. Sarah Chen",
      "body": "Dear Aisha Patel,\n\nYour appointment has been successfully confirmed!\n\nAPPOINTMENT DETAILS:\n...",
      "format": "text/plain"
    }
  },
  "appointmentDetails": {
    "patient": "Aisha Patel",
    "doctor": "Dr. Sarah Chen",
    "specialty": "Orthopedic Surgeon",
    "dateTime": "2025-11-26 at 2:00 PM",
    "location": "Metro Orthopedic Center",
    "address": "456 Medical Plaza, New York, NY 10002"
  },
  "method": "DEMO_MODE",
  "message": "In production, SMS and Email would be sent via Twilio/SendGrid",
  "timestamp": "2025-11-25T06:05:44.123Z"
}
```

---

## 🎨 Complete Frontend Flow (Code Example)

```javascript
// STEP 1: User uploads PDF
const handleFileUpload = async (pdfFile) => {
  try {
    // Extract patient data using local service
    const formData = new FormData();
    formData.append('file', pdfFile);
    
    const extractResponse = await fetch('http://localhost:3001/extract', {
      method: 'POST',
      body: formData
    });
    
    if (!extractResponse.ok) {
      throw new Error('Extraction failed');
    }
    
    const extracted = await extractResponse.json();
    const patientData = extracted.data;
    
    console.log('✅ Patient data extracted:', patientData);
    // { patientName, dateOfBirth, referralReason, insuranceProvider }
    
    return patientData;
    
  } catch (error) {
    console.error('❌ Extraction error:', error);
    throw error;
  }
};

// STEP 2: Find matching doctor
const findDoctor = async (patientData) => {
  try {
    const orchestrateResponse = await fetch(
      'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run/orchestrate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: patientData.patientName,
          referralReason: patientData.referralReason,
          insuranceProvider: patientData.insuranceProvider
        })
      }
    );
    
    const result = await orchestrateResponse.json();
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Orchestration failed');
    }
    
    console.log('✅ Doctor matched:', result.data);
    return result.data;
    
  } catch (error) {
    console.error('❌ Doctor matching error:', error);
    throw error;
  }
};

// STEP 3: Confirm appointment
const confirmAppointment = async (patientData, doctorMatch, selectedSlot) => {
  try {
    const confirmResponse = await fetch(
      'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run/confirm',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralId: doctorMatch.referralId,
          patientName: patientData.patientName,
          patientEmail: 'patient@email.com', // Get from user input
          patientPhone: '+1-555-0123',       // Get from user input
          doctorName: doctorMatch.assignedDoctor,
          specialty: doctorMatch.specialist,
          appointmentDate: selectedSlot.date,
          appointmentTime: selectedSlot.time
        })
      }
    );
    
    const confirmation = await confirmResponse.json();
    
    console.log('✅ Confirmation generated:', confirmation);
    return confirmation;
    
  } catch (error) {
    console.error('❌ Confirmation error:', error);
    throw error;
  }
};

// COMPLETE WORKFLOW
const handleReferralWorkflow = async (pdfFile) => {
  try {
    // Step 1: Extract
    const patientData = await handleFileUpload(pdfFile);
    
    // Step 2: Find Doctor
    const doctorMatch = await findDoctor(patientData);
    
    // Step 3: Confirm (after user selects slot)
    const selectedSlot = { 
      date: '2025-11-26', 
      time: '2:00 PM' 
    };
    const confirmation = await confirmAppointment(
      patientData, 
      doctorMatch, 
      selectedSlot
    );
    
    // Display confirmation to user
    console.log('SMS Preview:', confirmation.notifications.sms.message);
    console.log('Email Preview:', confirmation.notifications.email.body);
    
    return {
      patient: patientData,
      doctor: doctorMatch,
      confirmation: confirmation
    };
    
  } catch (error) {
    console.error('Workflow error:', error);
    throw error;
  }
};
```

---

## 🤖 Where AI is Used

| Step | AI Service | Purpose | Model |
|------|-----------|---------|-------|
| **PDF Extraction** | CEREBRAS Cloud | Parses text into structured data | llama3.1-8b |
| **Doctor Database** | Raindrop SmartSQL | Natural language queries (optional) | Built-in |
| **Future: SmartBucket** | Raindrop | Semantic PDF search | Built-in |

---

## 📄 Where PDF Files Are Handled

1. **User Browser** → Uploads PDF file
2. **Local Extraction Service (port 3001)** → Processes PDF:
   - Converts PDF → Text (pdf-parse library)
   - Sends text → CEREBRAS AI
   - Returns structured JSON
3. **Raindrop SmartBucket** → Stores original PDFs (optional, for records)

**Note:** PDFs are NOT sent to Raindrop for extraction anymore. They go to the local service.

---

## 🚦 Error Handling

```javascript
const handleErrors = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    
    switch (response.status) {
      case 400:
        alert('Invalid request: ' + error.message);
        break;
      case 404:
        alert('Resource not found');
        break;
      case 500:
        alert('Server error: ' + error.message);
        break;
      case 503:
        alert('Service temporarily unavailable, please retry');
        break;
      default:
        alert('An error occurred');
    }
    
    throw new Error(error.message || 'Request failed');
  }
  
  return response;
};

// Usage
const response = await fetch(url, options);
await handleErrors(response);
const data = await response.json();
```

---

## ⚙️ Starting Local Services

### Before Frontend Development

**Terminal 1: Start Extraction Service**
```bash
cd navigator-ai-backend/vultr-extraction-service
npm start

# Should see:
# 🚀 Vultr PDF Extraction Service
# 📍 Server running on: http://0.0.0.0:3001
```

**Terminal 2: Your Frontend**
```bash
cd frontend
npm run dev
```

**Raindrop Backend:** Already deployed, always running at:
```
https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run
```

---

## 🧪 Testing the Integration

### Quick Test Script

```bash
# Test extraction
curl -X POST http://localhost:3001/extract \
  -F "file=@path/to/Medical_Referral_Document_2.pdf"

# Test orchestration
curl -X POST https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run/orchestrate \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Aisha Patel",
    "referralReason": "Chronic right knee pain",
    "insuranceProvider": "United Healthcare HMO"
  }'

# Test confirmation
curl -X POST https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "referralId": "ref-15",
    "patientName": "Aisha Patel",
    "patientEmail": "aisha@email.com",
    "patientPhone": "+1-555-0123",
    "doctorName": "Dr. Sarah Chen",
    "specialty": "Orthopedic Surgeon",
    "appointmentDate": "2025-11-26",
    "appointmentTime": "2:00 PM"
  }'
```

---

## 📋 Summary Checklist for Frontend

- [ ] Local extraction service running on port 3001
- [ ] Frontend calls `localhost:3001/extract` for PDF processing
- [ ] Frontend calls Raindrop URL for `/orchestrate` and `/confirm`
- [ ] Error handling implemented for all endpoints
- [ ] Loading states for async operations
- [ ] Display extracted patient data for review
- [ ] Show matched doctor and available slots
- [ ] Display SMS/Email previews from confirmation

---

## 🆘 Troubleshooting

### Extraction service not starting
```bash
cd vultr-extraction-service
cat .env  # Check CEREBRAS_API_KEY is set
npm install
npm start
```

### CORS errors from frontend
The extraction service has CORS enabled. Raindrop also allows all origins (for now).

### Extraction returns empty/wrong data
- Check PDF has selectable text (not scanned image)
- Check CEREBRAS API key is valid
- View logs in extraction service terminal

---

## 📞 Support

If you encounter issues:
1. Check extraction service logs (Terminal 1)
2. Check browser console for errors
3. Test endpoints individually with curl
4. Verify all services are running

Good luck with your hackathon! 🚀
