#!/bin/bash
# Test Extraction with Neurology PDF
# This script uploads the PDF and tests extraction on production

PROD_URL="https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run"
PDF_PATH="/Users/dk_sukhani/code/navigator-ai-backend/backend/Urgent Neurology Referral (New Onset Seizure).pdf"

EXPECTED_PHONE="(512) 555-8821"
EXPECTED_EMAIL="a.chen95@webmail.com"

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║          🧪 TESTING BACKEND EXTRACTION WITH NEUROLOGY PDF                 ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Check file exists
echo "STEP 1: VERIFY PDF FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ ! -f "$PDF_PATH" ]; then
    echo "❌ PDF file not found: $PDF_PATH"
    exit 1
fi

SIZE=$(stat -f%z "$PDF_PATH" 2>/dev/null || stat -c%s "$PDF_PATH" 2>/dev/null)
SIZE_KB=$((SIZE / 1024))

echo "✅ PDF file found"
echo "   Size: ${SIZE_KB} KB"
echo "   Path: $PDF_PATH"
echo ""

# Step 2: Upload PDF
echo "STEP 2: UPLOAD PDF TO PRODUCTION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📤 Uploading PDF..."

UPLOAD_RESPONSE=$(curl -s -X POST \
  -F "file=@$PDF_PATH" \
  "$PROD_URL/upload")

echo "$UPLOAD_RESPONSE" | jq '.' >/dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Upload failed or invalid JSON response"
    echo "Response: $UPLOAD_RESPONSE"
    exit 1
fi

DOCUMENT_ID=$(echo "$UPLOAD_RESPONSE" | jq -r '.id')
if [ -z "$DOCUMENT_ID" ] || [ "$DOCUMENT_ID" = "null" ]; then
    echo "❌ No document ID in response"
    echo "Response: $UPLOAD_RESPONSE"
    exit 1
fi

echo "✅ Upload successful"
echo "   Document ID: $DOCUMENT_ID"
echo ""

# Step 3: Extract data
echo "STEP 3: EXTRACT DATA FROM PDF"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔍 Extracting data (waiting for Vultr service)..."

# Wait a bit for document to be ready
sleep 2

EXTRACT_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{\"id\": \"$DOCUMENT_ID\"}" \
  "$PROD_URL/extract")

echo "$EXTRACT_RESPONSE" | jq '.' >/dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Extraction failed or invalid JSON response"
    echo "Response: $EXTRACT_RESPONSE"
    exit 1
fi

if ! echo "$EXTRACT_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo "❌ Extraction returned success=false"
    echo "Response: $EXTRACT_RESPONSE"
    exit 1
fi

echo "✅ Extraction successful"
echo ""

# Step 4: Display results
echo "STEP 4: VERIFY EXTRACTED DATA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

EXTRACTED_DATA=$(echo "$EXTRACT_RESPONSE" | jq '.data.extractedData')

FIRST_NAME=$(echo "$EXTRACTED_DATA" | jq -r '.patientFirstName // "N/A"')
LAST_NAME=$(echo "$EXTRACTED_DATA" | jq -r '.patientLastName // "N/A"')
PHONE=$(echo "$EXTRACTED_DATA" | jq -r '.patientPhoneNumber // "null"')
EMAIL=$(echo "$EXTRACTED_DATA" | jq -r '.patientEmail // "null"')
REASON=$(echo "$EXTRACTED_DATA" | jq -r '.reason // "N/A"')
SPECIALTY=$(echo "$EXTRACTED_DATA" | jq -r '.specialty // "N/A"')
URGENCY=$(echo "$EXTRACTED_DATA" | jq -r '.urgency // "N/A"')

echo "📋 EXTRACTED INFORMATION:"
echo ""
echo "Name: $FIRST_NAME $LAST_NAME"
echo "Phone: $PHONE"
echo "Email: $EMAIL"
echo ""
echo "Reason: $REASON"
echo "Specialty: $SPECIALTY"
echo "Urgency: $URGENCY"
echo ""

# Step 5: Verify against expected values
echo "STEP 5: VERIFICATION AGAINST EXPECTED VALUES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📌 EXPECTED VALUES:"
echo "   Phone: $EXPECTED_PHONE"
echo "   Email: $EXPECTED_EMAIL"
echo ""

echo "🔎 ACTUAL VALUES:"
echo "   Phone: $PHONE"
echo "   Email: $EMAIL"
echo ""

# Compare
PHONE_MATCH="false"
EMAIL_MATCH="false"

if [ "$PHONE" = "$EXPECTED_PHONE" ]; then
    PHONE_MATCH="true"
    echo "   ✅ Phone: MATCH"
else
    echo "   ❌ Phone: MISMATCH"
fi

if [ "$EMAIL" = "$EXPECTED_EMAIL" ]; then
    EMAIL_MATCH="true"
    echo "   ✅ Email: MATCH"
else
    echo "   ❌ Email: MISMATCH"
fi

echo ""

# Final verdict
echo "STEP 6: FINAL VERDICT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$PHONE_MATCH" = "true" ] && [ "$EMAIL_MATCH" = "true" ]; then
    echo "🎉 ✅ SUCCESS - BOTH PHONE AND EMAIL EXTRACTED CORRECTLY"
    echo ""
    echo "   Backend extraction is working perfectly!"
    echo "   The system successfully extracted:"
    echo "   • Phone: $PHONE"
    echo "   • Email: $EMAIL"
    echo ""
    echo "   ✓ Vultr service is responding"
    echo "   ✓ CEREBRAS AI is extracting correctly"
    echo "   ✓ Backend fallback logic is working"
    echo ""
    echo "   Next step: Frontend needs to use these extracted values"
    EXIT_CODE=0
elif [ "$PHONE_MATCH" = "true" ] || [ "$EMAIL_MATCH" = "true" ]; then
    echo "⚠️  PARTIAL SUCCESS - One field extracted correctly"
    EXIT_CODE=1
else
    echo "❌ EXTRACTION FAILED - Neither field matched expected values"
    EXIT_CODE=1
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""
echo "📊 FULL EXTRACTED DATA:"
echo ""
echo "$EXTRACTED_DATA" | jq '.'
echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""

exit $EXIT_CODE
