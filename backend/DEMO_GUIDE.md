# Navigator-AI Backend Demo Guide
## Step-by-Step Instructions for Screen Recording

### Prerequisites
- Terminal open
- Navigate to the backend folder: `cd /Users/dk_sukhani/code/navigator-ai-backend/backend`
- Have your PDF files ready (Medical Referral Document 1.pdf, 2.pdf, 3.pdf)

---

## Demo Flow

### Step 0: Build the Project (First Time Only)
```bash
npm run build
```

**What to show:**
- TypeScript compilation completing successfully

---

### Step 1: Start the Server
```bash
npm start
```

**What to show:**
- Terminal output showing "Server running on port 3000"
- Keep this terminal window visible

---

### Step 2: Open a New Terminal Window
Open a second terminal window (keep the server running in the first one)

Navigate to the backend folder:
```bash
cd /Users/dk_sukhani/code/navigator-ai-backend/backend
```

---

### Step 3: Test the Healthcheck
```bash
curl http://localhost:3000/ping
```

**Expected Output:**
```
pong
```

**What to say:**
"First, let's verify the server is running with a simple ping test."

---

### Step 4: Upload a Medical Referral Document
```bash
curl -X POST -F "file=@Medical Referral Document 1.pdf" http://localhost:3000/upload
```

**Expected Output:**
```json
{
  "message": "File uploaded successfully",
  "filename": "Medical Referral Document 1.pdf"
}
```

**What to say:**
"Now we upload a doctor's referral document. The system stores it in Raindrop's SmartBucket storage."

---

### Step 5: Extract Patient Information (AI)
```bash
curl -X POST http://localhost:3000/extract \
  -H "Content-Type: application/json" \
  -d '{"filename": "Medical Referral Document 1.pdf"}'
```

**Expected Output:**
```json
{
  "patientName": "John Doe",
  "dateOfBirth": "1980-01-01",
  "referralReason": "Cardiology consultation",
  "insuranceProvider": "BlueCross"
}
```

**What to say:**
"The AI reads the document and extracts key information: patient name, date of birth, referral reason, and insurance provider."

---

### Step 6: Workflow Orchestration
```bash
curl -X POST http://localhost:3000/orchestrate \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "referralReason": "Cardiology consultation",
    "insuranceProvider": "BlueCross"
  }'
```

**Expected Output:**
```json
{
  "specialist": "Cardiologist",
  "insuranceStatus": "Approved",
  "availableSlots": [
    "2025-11-20T10:00:00Z",
    "2025-11-21T14:00:00Z"
  ]
}
```

**What to say:**
"The system automatically determines the right specialist (Cardiologist), verifies insurance eligibility (Approved), and finds available appointment slots."

---

### Step 7: Patient Confirmation
```bash
curl -X POST http://localhost:3000/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "slot": "2025-11-20T10:00:00Z"
  }'
```

**Expected Output:**
```json
{
  "message": "Confirmation sent successfully",
  "status": "Sent"
}
```

**What to say:**
"Finally, the patient selects a time slot and the system sends a confirmation via SMS or email."

---

### Step 8: Run the Complete Flow Test (Optional)
For a more automated demo, run:
```bash
node test-local.mjs
```

This will execute all 5 steps automatically and show the complete flow.

---

## Demo Script Summary

### Opening (5 seconds)
"This is Navigator-AI, an automated healthcare referral workflow system built with Raindrop and deployed on Vultr."

### The Problem (10 seconds)
"Currently, healthcare referrals are manual, slow, and error-prone. Patients wait days for appointments, and staff spend hours on paperwork."

### The Solution (30 seconds)
"Navigator-AI automates the entire process:
1. Upload a doctor's referral document
2. AI extracts patient information
3. System finds the right specialist and checks insurance
4. Patient gets appointment options instantly
5. Confirmation sent automatically"

### Live Demo (60 seconds)
[Run through Steps 3-7 above]

### Tech Stack (10 seconds)
"Built with:
- Backend: Node.js + Express + TypeScript
- AI: Raindrop SmartBuckets for document processing
- Storage: Raindrop SmartSQL and SmartMemory
- Deployment: Vultr Cloud Platform"

### Closing (5 seconds)
"From hours to seconds. That's Navigator-AI."

---

## Tips for Recording

1. **Terminal Setup:**
   - Use a large font size (18-20pt) for readability
   - Use a dark theme (easier on the eyes)
   - Clear the terminal before each command: `clear`

2. **Pacing:**
   - Pause 2-3 seconds after each command before running it
   - Let the output display fully before moving to the next step

3. **Narration:**
   - Speak clearly and not too fast
   - Explain what's happening, not just what you're typing

4. **Visual Flow:**
   - Show the server terminal in one window
   - Show the curl commands in another window
   - Consider using a split-screen view

5. **Highlight Key Points:**
   - Point out the "File uploaded successfully" message
   - Highlight the extracted patient data
   - Show the specialist matching (Cardiology → Cardiologist)
   - Emphasize the instant appointment slots

---

## Troubleshooting

**If the server isn't running:**
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill any process using port 3000
kill -9 <PID>

# Restart the server
npm start
```

**If you get "Connection refused":**
- Make sure the server is running in the first terminal
- Check that you're using `http://localhost:3000` (not https)

**If file upload fails:**
- Verify the PDF file exists: `ls -la "Medical Referral Document 1.pdf"`
- Make sure you're in the backend directory

---

## Quick Copy-Paste Commands

For easy recording, here are all commands in order:

```bash
# Terminal 1: Start server
npm start

# Terminal 2: Run tests
curl http://localhost:3000/ping

curl -X POST -F "file=@Medical Referral Document 1.pdf" http://localhost:3000/upload

curl -X POST http://localhost:3000/extract -H "Content-Type: application/json" -d '{"filename": "Medical Referral Document 1.pdf"}'

curl -X POST http://localhost:3000/orchestrate -H "Content-Type: application/json" -d '{"patientName": "John Doe", "referralReason": "Cardiology consultation", "insuranceProvider": "BlueCross"}'

curl -X POST http://localhost:3000/confirm -H "Content-Type: application/json" -d '{"patientName": "John Doe", "slot": "2025-11-20T10:00:00Z"}'
```
