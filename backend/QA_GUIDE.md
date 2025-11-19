# Navigator-AI Backend QA Guide

This guide explains how to manually test the backend flow using `curl` commands. You can also use tools like Postman or Insomnia.

## Prerequisites
- Node.js installed.
- Terminal open in the `backend` directory.
- A sample PDF file (e.g., `prescription.pdf`) in the `backend` directory for testing.

## 1. Start the Server
Open a terminal in the `backend` folder and run:
```bash
npm start
```
You should see: `Server running on port 3000`.

## 2. The Testing Flow

### Step 1: Healthcheck
Verify the server is up.
```bash
curl http://localhost:3000/ping
```
**Expected Output**: `pong`

### Step 2: Upload Document
Upload your mock prescription PDF.
```bash
# Make sure you have a file named 'prescription.pdf' in your current directory
curl -X POST -F "file=@prescription.pdf" http://localhost:3000/upload
```
**Expected Output**:
```json
{
  "message": "File uploaded successfully",
  "filename": "prescription.pdf"
}
```

### Step 3: AI Extraction
Simulate extracting data from the uploaded file.
```bash
curl -X POST http://localhost:3000/extract \
  -H "Content-Type: application/json" \
  -d '{"filename": "prescription.pdf"}'
```
**Expected Output**:
```json
{
  "patientName": "John Doe",
  "dateOfBirth": "1980-01-01",
  "referralReason": "Cardiology consultation",
  "insuranceProvider": "BlueCross"
}
```

### Step 4: Workflow Orchestration
Use the extracted data to find a specialist and check insurance.
```bash
curl -X POST http://localhost:3000/orchestrate \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "referralReason": "Cardiology consultation",
    "insuranceProvider": "BlueCross"
  }'
```
**Expected Output**:
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

### Step 5: Patient Confirmation
Confirm the appointment slot.
```bash
curl -X POST http://localhost:3000/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "slot": "2025-11-20T10:00:00Z"
  }'
```
**Expected Output**:
```json
{
  "message": "Confirmation sent successfully",
  "status": "Sent"
}
```

## Summary of Flow
1. **Upload**: The doctor's referral is uploaded to Raindrop storage.
2. **Extract**: AI reads the document and pulls out patient info and referral reason.
3. **Orchestrate**: The system identifies the right specialist (e.g., Cardiologist), checks insurance eligibility, and finds open slots in the schedule.
4. **Confirm**: The patient selects a slot, and the system sends a confirmation (mocked SMS/Email).
