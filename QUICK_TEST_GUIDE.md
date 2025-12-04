# Quick Reference: Backend Extraction Validation

## TL;DR

To verify backend extraction with the Neurology PDF:

```bash
# Make executable
chmod +x test-extraction.sh

# Run test
./test-extraction.sh
```

## Expected Output on Success

```
🎉 ✅ SUCCESS - BOTH PHONE AND EMAIL EXTRACTED CORRECTLY

   Backend extraction is working perfectly!
   The system successfully extracted:
   • Phone: (512) 555-8821
   • Email: a.chen95@webmail.com

   ✓ Vultr service is responding
   ✓ CEREBRAS AI is extracting correctly
   ✓ Backend fallback logic is working

   Next step: Frontend needs to use these extracted values
```

## Expected Values from PDF

| Field | Value |
|-------|-------|
| **Phone** | (512) 555-8821 |
| **Email** | a.chen95@webmail.com |

## System Flow

```
PDF Upload (test-extraction.sh)
    ↓
Backend /upload endpoint
    ↓ (stores in SmartBucket)
Backend /extract endpoint
    ↓ (calls Vultr at 139.180.220.93:3001)
Vultr Service (pdf-parse + CEREBRAS)
    ↓
Returns: patientPhoneNumber, patientEmail
    ↓
✅ Success if values match expected
```

## What Gets Tested

✅ PDF upload to SmartBucket  
✅ Backend extract endpoint  
✅ Vultr extraction service connectivity  
✅ CEREBRAS AI extraction capability  
✅ Phone number regex extraction  
✅ Email address regex extraction  
✅ Data format and normalization  

## Success = Backend Working

If phone and email extract correctly, it proves:
- ✅ Backend extraction is working perfectly
- ✅ Vultr service is operational
- ✅ CEREBRAS AI model is responding
- ✅ PDF contains machine-readable text
- ✅ Data pipeline is functioning end-to-end

## Failure Causes

| Symptom | Cause | Solution |
|---------|-------|----------|
| Upload fails | File not found | Check file path exists |
| Extract returns error | Service down | Check Vultr health endpoint |
| Phone/Email null | PDF is scanned | Use OCR or text-based PDF |
| Wrong format | Regex mismatch | Frontend format conversion |

## Files Needed

- `/Users/dk_sukhani/code/navigator-ai-backend/backend/Urgent Neurology Referral (New Onset Seizure).pdf` - Test PDF ✅
- `test-extraction.sh` - Test script ✅
- `test-neurology-extraction.mjs` - Node.js alternative ✅

## Production URLs

| Service | URL |
|---------|-----|
| Backend API | https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run |
| Vultr Service | http://139.180.220.93:3001 |

## Verification Checklist

- [ ] Run test-extraction.sh
- [ ] Phone extracted: (512) 555-8821
- [ ] Email extracted: a.chen95@webmail.com
- [ ] Both fields match exactly
- [ ] Backend extraction confirmed working
- [ ] Document for frontend team created
- [ ] Know root cause: FE hardcoding instead of using backend values

---

**Last Updated:** December 4, 2025  
**Status:** Ready for Production Testing  
**Expected Duration:** ~10 seconds per test run
