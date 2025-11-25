# Frontend Integration Guide - Complete Flow

> **🚀 New to the project?** Start with the [Local Setup Guide](LOCAL_SETUP.md) to get everything running first!

---

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

## 🤔 Understanding What Happens During Extraction

### Where Does Each Step Happen?

```
┌─────────────────────────────────────────────────────┐
│  FRONTEND (Browser - User's Computer)              │
│                                                     │
│  1. User selects PDF file                          │
│  2. Frontend creates FormData                      │
│  3. Sends PDF to extraction service                │
│     ↓                                               │
│  [FRONTEND DOES NOTHING TO THE PDF]                │
│     ↓                                               │
│  4. Receives structured JSON back                  │
│  5. Displays patient data to user                  │
└─────────────────────────────────────────────────────┘
                      ↓ PDF file
                      ↓
┌─────────────────────────────────────────────────────┐
│  EXTRACTION SERVICE (Backend)                       │
│  Port 3001 (Local) or Vultr Server (Deployed)      │
│                                                     │
│  [THIS IS WHERE ALL THE WORK HAPPENS]              │
│                                                     │
│  Step 1: Receives PDF file                         │
│     ↓                                               │
│  Step 2: pdf-parse library extracts TEXT           │
│          PDF bytes → Raw text string               │
│          "PATIENT INFORMATION                      │
│           Name: Aisha Patel                        │
│           DOB: July 22, 1985..."                   │
│     ↓                                               │
│  Step 3: Sends text to CEREBRAS AI Cloud           │
│     ↓                                               │
│  Step 4: CEREBRAS returns structured JSON          │
│          { "patientName": "Aisha Patel",           │
│            "dateOfBirth": "1985-07-22", ... }      │
│     ↓                                               │
│  Step 5: Returns JSON to frontend                  │
└─────────────────────────────────────────────────────┘
                      ↓ Text
                      ↓
┌─────────────────────────────────────────────────────┐
│  CEREBRAS CLOUD (AI Processing)                    │
│                                                     │
│  - Receives raw text from extraction service       │
│  - Uses llama3.1-8b model                          │
│  - Understands medical terminology                 │
│  - Structures data intelligently                   │
│  - Returns JSON                                    │
└─────────────────────────────────────────────────────┘
```

### What Frontend Does (Simple):

```javascript
// ONLY sends PDF, receives JSON
const formData = new FormData();
formData.append('file', pdfFile);

const response = await fetch('http://localhost:3001/extract', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.data); // Already structured!
```

**Frontend does NOT:**
- ❌ Parse PDF
- ❌ Extract text
- ❌ Call CEREBRAS
- ❌ Structure data

All of this happens in the extraction service!

---

## 💪 The Power of CEREBRAS AI - Why We Use It

### ❌ Without AI (Just pdf-parse):

pdf-parse gives you **raw, unstructured text**:

```
CEDARS-SINAI MEDICAL CENTER
8700 Beverly Boulevard, Los Angeles, CA 90048
Tel: (310) 423-3277 | Fax: (310) 423-0811


ORTHOPEDIC SURGERY REFERRAL

Date: November 18, 2025
Referral ID: CS-2025-12394

REFERRING PHYSICIAN

Dr. James Rodriguez, MD
Family Medicine
Cedars-Sinai Primary Care - Beverly Hills
Phone: (310) 423-9800

PATIENT INFORMATION

Name: Aisha Patel
DOB: July 22, 1985 (Age: 40)
Gender: Female
Insurance: United Healthcare HMO
Policy #: UHC-CA-4428387
Address: 9204 Wilshire Blvd, Apt 3B, Beverly Hills, CA 90212

REFERRAL TO

Specialty: Orthopedic Surgery (Sports Medicine)
Reason: Chronic right knee pain, suspected meniscal tear
Urgency: Semi-urgent (within 1 week)
```

**Problem:** This is a mess! How do you extract structured fields?

### 🤖 Traditional Approach (Regex/Rules):

You'd need hundreds of lines of fragile code:

```javascript
// Manually parse with regex (VERY FRAGILE)
const nameRegex = /Name:\s*([A-Za-z\s]+)/;
const dobRegex = /(January|February|March|April|May|...) \d{1,2}, \d{4}/;
const insuranceRegex = /Insurance:\s*([A-Z\s]+)/;

function extractPatient(text) {
  // Handle "Name:"
  // Handle "Patient:"
  // Handle "Patient Name:"
  // Handle "Full Name:"
  // What if there's no label?!
  
  // Convert "July 22, 1985"
  // Convert "07/22/1985"
  // Convert "1985-07-22"
  // Convert "22 Jul 1985"
  // ...20+ different formats!
  
  // Find referring vs patient vs doctor names
  // Which "name" is the patient?!
}
```

**This breaks easily when:**
- Format changes slightly
- Different hospital uses different labels
- Dates in different formats
- Fields in different order

---

### ✨ With CEREBRAS AI (Intelligent):

```javascript
// Just ask intelligently
const prompt = `Extract patient info from: ${text}`;

// CEREBRAS understands:
// - Context (which name is patient vs doctor)
// - Medical terminology
// - Date format variations
// - Unstructured data
```

### What CEREBRAS AI Does for You:

#### 1. **Understands Context**

```
Text: "Dr. James Rodriguez, MD ... Name: Aisha Patel"

CEREBRAS knows:
✅ "Aisha Patel" = PATIENT (not doctor)
❌ "Dr. James Rodriguez" = REFERRING PHYSICIAN (not patient)
```

Normal code would grab the first name it sees (wrong!).

#### 2. **Intelligent Date Conversion**

```
Input variations:
- "DOB: July 22, 1985 (Age: 40)"
- "Date of Birth: 07/22/1985"
- "Born: 22 Jul 1985"
- "1985-07-22"

CEREBRAS output (all cases):
→ "1985-07-22"
```

#### 3. **Medical Understanding**

```
Text: "Chronic right knee pain, suspected meniscal tear"

CEREBRAS understands:
✅ This is a medical condition (referral reason)
✅ "Chronic" + "knee" = orthopedic specialty
✅ Structures it properly

Not just random text!
```

#### 4. **Handles Variations**

```
Document A: "Name: Aisha Patel"
Document B: "Patient: John Doe"  
Document C: "John Smith (patient information)"
Document D: "The patient, Sarah Johnson, is experiencing..."

CEREBRAS extracts patient name from ALL formats!
```

Regex would need 50+ patterns and still miss cases.

#### 5. **Normalizes Data**

```
Text: "Insurance: United Healthcare HMO"
CEREBRAS: "United Healthcare HMO"

Text: "Ins: UHC"
CEREBRAS: "UHC" (or expands to full name if context available)

Text: "Payer: Blue Cross Blue Shield PPO"
CEREBRAS: "Blue Cross Blue Shield PPO"
```

#### 6. **Finds Unlabeled Fields**

```
Sometimes PDFs don't have labels:

"Patient is Aisha Patel experiencing chronic knee pain, 
insurance through United Healthcare..."

CEREBRAS still finds:
- Patient name: "Aisha Patel"
- Condition: "chronic knee pain"  
- Insurance: "United Healthcare"
```

---

### 📊 Real Example from Your System

**Input (pdf-parse output):**
```
PATIENT INFORMATION
Name: Aisha Patel
DOB: July 22, 1985 (Age: 40)
Gender: Female
MRN: CS-992841
Insurance: United Healthcare HMO
Policy #: UHC-CA-4428387

REFERRAL TO
Specialty: Orthopedic Surgery (Sports Medicine)
Reason: Chronic right knee pain, suspected meniscal tear
```

**CEREBRAS Output:**
```json
{
  "patientName": "Aisha Patel",
  "dateOfBirth": "1985-07-22",
  "referralReason": "Chronic right knee pain, suspected meniscal tear",
  "insuranceProvider": "United Healthcare HMO"
}
```

**What CEREBRAS Did:**
1. ✅ Found patient name (not doctor, not facility)
2. ✅ Converted "July 22, 1985" → "1985-07-22"
3. ✅ Ignored noise like "(Age: 40)" and "MRN:"
4. ✅ Extracted exact referral reason
5. ✅ Got full insurance name (not policy number)

---

### 🆚 Comparison

| Approach | Lines of Code | Handles Variations? | Breaks Easily? |
|----------|---------------|---------------------|----------------|
| **Regex/Rules** | 500+ | ❌ No | ✅ Yes |
| **CEREBRAS AI** | 20 | ✅ Yes | ❌ No |

### Why CEREBRAS is Powerful:

- **Natural Language Understanding** - Reads like a human
- **Context Awareness** - Knows which data is which
- **Medical Knowledge** - Understands terminology
- **Format Agnostic** - Works with any PDF layout
- **Self-Learning** - Adapts to variations
- **Fast** - 2-4 second response time

**This is why we use AI!** It's not just formatting - it's intelligent understanding.

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
