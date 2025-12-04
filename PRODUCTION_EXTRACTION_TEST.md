# Production Extraction Test with Neurology PDF

## Test Overview

Testing backend extraction with the "Urgent Neurology Referral (New Onset Seizure).pdf" file to confirm:
- ✅ Phone extracted as: **(512) 555-8821**
- ✅ Email extracted as: **a.chen95@webmail.com**

## How to Run the Test

### Option 1: Using Bash Script (Recommended)
```bash
chmod +x /Users/dk_sukhani/code/navigator-ai-backend/test-extraction.sh
/Users/dk_sukhani/code/navigator-ai-backend/test-extraction.sh
```

### Option 2: Using Node.js Script
```bash
cd /Users/dk_sukhani/code/navigator-ai-backend
node test-neurology-extraction.mjs
```

### Option 3: Manual cURL Commands

**Step 1: Upload PDF**
```bash
curl -X POST \
  -F "file=@/Users/dk_sukhani/code/navigator-ai-backend/backend/Urgent\ Neurology\ Referral\ \(New\ Onset\ Seizure\).pdf" \
  https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run/upload
```

**Response (save the `id` value):**
```json
{
  "success": true,
  "id": "document-id-here"
}
```

**Step 2: Extract Data**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"id": "document-id-here"}' \
  https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run/extract
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "extractedData": {
      "patientFirstName": "A",
      "patientLastName": "Chen",
      "patientPhoneNumber": "(512) 555-8821",
      "patientEmail": "a.chen95@webmail.com",
      "reason": "New Onset Seizure",
      "specialty": "Neurologist",
      "urgency": "urgent",
      "payer": "Medicare",
      "plan": "Standard",
      ...
    }
  }
}
```

## Expected Results

### ✅ Success Criteria
- Phone field shows: `(512) 555-8821`
- Email field shows: `a.chen95@webmail.com`
- Both fields match expected values exactly

### What This Confirms
1. ✅ PDF was uploaded successfully to SmartBucket
2. ✅ Backend `/extract` endpoint is working
3. ✅ Vultr service (139.180.220.93:3001) is responding
4. ✅ CEREBRAS AI is extracting data correctly
5. ✅ Backend fallback regex extraction is working
6. ✅ Phone/email formatted correctly

### If Test Passes
- **Backend extraction is 100% working** ✅
- Phone and email are successfully extracted from the PDF
- The form showing empty fields is purely a **frontend issue**
- Frontend is receiving the correct data but not displaying it

### If Test Fails

**Case: Phone/Email are null or "Unknown"**
- Vultr extraction not finding the data
- Possible causes:
  - PDF is scanned/image-only
  - Text extraction failed
  - CEREBRAS API key missing/invalid
  - Data format not matching patterns

**Case: Phone/Email have different format**
- Extraction is working but formatting differently
- Example: `512-555-8821` instead of `(512) 555-8821`
- This is expected and format conversion can be added

## Integration with Frontend

Once extraction is confirmed working:

1. **Backend is providing** phone and email in the response
2. **Frontend needs to pass** these values through to the form
3. **Current frontend bug**: Hardcoding fake values instead of using extracted data

**File to fix**: `/frontend/hooks/use-referral-upload.ts`

```typescript
// Current (WRONG):
const patientEmail = `${patientData.patientName.toLowerCase()}@example.com`;
const patientPhone = "+1-555-0100";

// Should be (CORRECT):
const patientEmail = extractedData.patientEmail;
const patientPhone = extractedData.patientPhoneNumber;
```

## Documentation Files Created

- `test-extraction.sh` - Bash script for testing (easiest option)
- `test-neurology-extraction.mjs` - Node.js script with detailed output
- `verify-backend-extraction.mjs` - Comprehensive verification report
- `check-extraction-status.mjs` - Quick status check
- `BACKEND_EXTRACTION_VERIFICATION.md` - Complete technical documentation

## Troubleshooting

### If upload fails
- Check file path is correct
- Verify file exists and is readable
- Ensure file is valid PDF

### If extraction returns error
- Check document ID is correct
- Wait 1-2 seconds after upload before extracting
- Verify Vultr service is running: `curl http://139.180.220.93:3001/health`

### If fields are null
- PDF might be scanned/image-only
- Try with a different PDF that has searchable text
- Check CEREBRAS API key on Vultr service

## Next Steps

1. Run the test script
2. Confirm phone and email are extracted correctly
3. If successful, report: "✅ Backend extraction verified working"
4. Frontend team can then fix the hardcoding issue
