# Frontend Integration Guide - ID-Based API

## ✅ Updated API Workflow

### Base URL
```
https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run
```

---

## 📋 Complete Workflow

### **Step 1: Upload PDF**
Upload a medical referral PDF and receive a unique document ID.

```javascript
const formData = new FormData();
formData.append('file', pdfFile); // File from <input type="file">

const uploadResponse = await fetch(`${BASE_URL}/upload`, {
  method: 'POST',
  body: formData
});

const result = await uploadResponse.json();
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "id": "doc-1764027855222-sbspdwuvj6f",
  "uploadedAt": "2025-11-24T23:44:17.324Z"
}
```

**Save the `id` - you'll need it for extraction!**

---

### **Step 2: Extract Patient Data**
Use the document ID to extract patient information via CEREBRAS AI.

```javascript
const extractResponse = await fetch(`${BASE_URL}/extract`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: result.id  // ⭐ Use the ID from step 1
  })
});

const patientData = await extractResponse.json();
```

**Response:**
```json
{
  "patientName": "Lisa Kowalski",
  "dateOfBirth": "1992-09-05",
  "referralReason": "Type 2 Diabetes Mellitus",
  "insuranceProvider": "Aetna PPO"
}
```

---

### **Step 3: Find Specialist**
Find a matching doctor based on the extracted patient data.

```javascript
const orchestrateResponse = await fetch(`${BASE_URL}/orchestrate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientName: patientData.patientName,
    referralReason: patientData.referralReason,
    insuranceProvider: patientData.insuranceProvider
  })
});

const doctorMatch = await orchestrateResponse.json();
```

**Response:**
```json
{
  "success": true,
  "data": {
    "referralId": "ref-14",
    "status": "Processed",
    "specialist": "Endocrinologist",
    "assignedDoctor": "Dr. Michael Lee",
    "insuranceStatus": "Approved",
    "availableSlots": [
      "2025-11-26T14:00:00.000Z",
      "2025-11-27T13:00:00.000Z"
    ]
  }
}
```

---

### **Step 4: Confirm Appointment**
Generate confirmation SMS and email previews.

```javascript
const confirmResponse = await fetch(`${BASE_URL}/confirm`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    referralId: doctorMatch.data.referralId,
    patientName: patientData.patientName,
    patientEmail: 'patient@email.com',
    patientPhone: '+1-555-0123',
    doctorName: doctorMatch.data.assignedDoctor,
    specialty: doctorMatch.data.specialist,
    appointmentDate: '2024-11-26',
    appointmentTime: '10:00 AM'
  })
});

const confirmation = await confirmResponse.json();
```

**Response:**
```json
{
  "success": true,
  "confirmationSent": true,
  "notifications": {
    "sms": {
      "to": "+1-555-0123",
      "message": "Hi Lisa! Your Endocrinologist appointment with Dr. Michael Lee is confirmed..."
    },
    "email": {
      "to": "patient@email.com",
      "subject": "Appointment Confirmed - Dr. Michael Lee",
      "body": "Dear Lisa,\n\nYour appointment has been confirmed!..."
    }
  },
  "method": "DEMO_MODE"
}
```

---

## 🎨 UI Flow Recommendation

### Screen 1: Upload
- Drag-and-drop zone for PDF
- "Upload Document" button
- Loading spinner during upload

### Screen 2: Review Patient Data
- Display cards with extracted info:
  - **Patient Name**: Lisa Kowalski
  - **Date of Birth**: 1992-09-05
  - **Condition**: Type 2 Diabetes Mellitus
  - **Insurance**: Aetna PPO
- "Find Specialist" button

### Screen 3: Doctor Match
- Doctor card:
  - Name: Dr. Michael Lee
  - Specialty: Endocrinologist
  - Available times (select from slots)
- "Confirm Appointment" button

### Screen 4: Confirmation
- Success message
- SMS preview
- Email preview
- "Done" / "Upload Another" buttons

---

## ⚡ Key Changes from Previous Version

1. **Upload returns `id`** instead of `filename`
2. **Extract expects `id`** instead of `filename`
3. **Document ID format**: `doc-{timestamp}-{randomString}`
4. **Orchest rate and Confirm** remain unchanged

---

## 🔍 Error Handling

```javascript
// Check for errors in all responses
if (!response.ok) {
  const error = await response.json();
  console.error('API Error:', error);
  // Show error message to user
}

// Validate required fields
if (!result.id) {
  throw new Error('Upload failed: No document ID received');
}
```

---

## 📌 Important Notes

- ✅ No delay needed between upload and extract
- ✅ Document ID is unique and can be used to retrieve the file later
- ✅ All endpoints support CORS (already configured)
- ✅ CEREBRAS AI provides instant extraction
- ⚠️ Current specialty matching uses keywords (may need refinement)

---

## 🚀 Ready to Build!

You now have everything you need to build the frontend. The API is:
- 100% deployed and working
- Using real CEREBRAS AI for extraction
- Using real database for doctor matching
- Generating realistic confirmations

Start building and let me know if you need any adjustments!
