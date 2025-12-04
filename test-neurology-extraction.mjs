#!/usr/bin/env node
/**
 * TEST EXTRACTION WITH NEUROLOGY PDF
 * Uploads the provided PDF and verifies phone/email extraction
 */

import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';

const PROD_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';
const PDF_PATH = '/Users/dk_sukhani/code/navigator-ai-backend/backend/Urgent Neurology Referral (New Onset Seizure).pdf';

// Expected values from the PDF
const EXPECTED_PHONE = '(512) 555-8821';
const EXPECTED_EMAIL = 'a.chen95@webmail.com';

async function testExtraction() {
  console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║          🧪 TESTING BACKEND EXTRACTION WITH NEUROLOGY PDF                 ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');
  
  console.log(`📍 Production API: ${PROD_URL}`);
  console.log(`📄 PDF File: ${PDF_PATH}\n`);
  
  try {
    // Step 1: Check file exists
    console.log('━'.repeat(80));
    console.log('STEP 1: VERIFY PDF FILE');
    console.log('━'.repeat(80) + '\n');
    
    if (!fs.existsSync(PDF_PATH)) {
      console.error(`❌ PDF file not found: ${PDF_PATH}`);
      process.exit(1);
    }
    
    const stats = fs.statSync(PDF_PATH);
    console.log(`✅ PDF file found`);
    console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   Path: ${PDF_PATH}\n`);
    
    // Step 2: Upload PDF
    console.log('━'.repeat(80));
    console.log('STEP 2: UPLOAD PDF TO PRODUCTION');
    console.log('━'.repeat(80) + '\n');
    
    console.log('📤 Uploading PDF...');
    const form = new FormData();
    form.append('file', fs.createReadStream(PDF_PATH), 'Urgent Neurology Referral (New Onset Seizure).pdf');
    
    const uploadRes = await fetch(`${PROD_URL}/upload`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    
    if (!uploadRes.ok) {
      console.error(`❌ Upload failed: ${uploadRes.status}`);
      const text = await uploadRes.text();
      console.error(`Response: ${text}`);
      process.exit(1);
    }
    
    const uploadData = await uploadRes.json();
    console.log(`✅ Upload successful`);
    console.log(`   Document ID: ${uploadData.id}\n`);
    
    const documentId = uploadData.id;
    
    // Step 3: Extract data
    console.log('━'.repeat(80));
    console.log('STEP 3: EXTRACT DATA FROM PDF');
    console.log('━'.repeat(80) + '\n');
    
    console.log('🔍 Extracting data...');
    
    // Add small delay to ensure document is ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const extractRes = await fetch(`${PROD_URL}/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: documentId })
    });
    
    if (!extractRes.ok) {
      console.error(`❌ Extraction failed: ${extractRes.status}`);
      const text = await extractRes.text();
      console.error(`Response: ${text}`);
      process.exit(1);
    }
    
    const extractData = await extractRes.json();
    console.log(`✅ Extraction successful\n`);
    
    // Step 4: Display and verify results
    console.log('━'.repeat(80));
    console.log('STEP 4: VERIFY EXTRACTED DATA');
    console.log('━'.repeat(80) + '\n');
    
    const data = extractData.data.extractedData;
    
    console.log('📋 EXTRACTED INFORMATION:\n');
    console.log(`Name: ${data.patientFirstName} ${data.patientLastName}`);
    console.log(`Phone: ${data.patientPhoneNumber || 'NOT EXTRACTED'}`);
    console.log(`Email: ${data.patientEmail || 'NOT EXTRACTED'}`);
    console.log(`\nReason: ${data.reason || 'N/A'}`);
    console.log(`Specialty: ${data.specialty || 'N/A'}`);
    console.log(`Urgency: ${data.urgency || 'N/A'}`);
    console.log(`Provider: ${data.providerName || 'N/A'}`);
    console.log(`Insurance: ${data.payer || 'N/A'}`);
    console.log(`Plan: ${data.plan || 'N/A'}\n`);
    
    // Step 5: Verify against expected values
    console.log('━'.repeat(80));
    console.log('STEP 5: VERIFICATION AGAINST EXPECTED VALUES');
    console.log('━'.repeat(80) + '\n');
    
    console.log('📌 EXPECTED VALUES:');
    console.log(`   Phone: ${EXPECTED_PHONE}`);
    console.log(`   Email: ${EXPECTED_EMAIL}\n`);
    
    console.log('🔎 ACTUAL VALUES:');
    console.log(`   Phone: ${data.patientPhoneNumber || 'NOT EXTRACTED'}`);
    console.log(`   Email: ${data.patientEmail || 'NOT EXTRACTED'}\n`);
    
    const phoneMatch = data.patientPhoneNumber === EXPECTED_PHONE;
    const emailMatch = data.patientEmail === EXPECTED_EMAIL;
    
    console.log('✓ MATCH RESULTS:');
    console.log(`   Phone: ${phoneMatch ? '✅ MATCH' : '❌ MISMATCH'}`);
    console.log(`   Email: ${emailMatch ? '✅ MATCH' : '❌ MISMATCH'}\n`);
    
    // Final verdict
    console.log('━'.repeat(80));
    console.log('FINAL VERDICT');
    console.log('━'.repeat(80) + '\n');
    
    if (phoneMatch && emailMatch) {
      console.log('🎉 ✅ SUCCESS - BOTH PHONE AND EMAIL EXTRACTED CORRECTLY');
      console.log('\n   Backend extraction is working perfectly!');
      console.log('   The system successfully extracted:');
      console.log(`   • Phone: ${data.patientPhoneNumber}`);
      console.log(`   • Email: ${data.patientEmail}`);
      console.log('\n   Next step: Frontend needs to use these extracted values');
    } else if (phoneMatch || emailMatch) {
      console.log('⚠️  PARTIAL SUCCESS - One field extracted correctly');
      if (phoneMatch) {
        console.log(`   ✅ Phone: ${data.patientPhoneNumber}`);
        console.log(`   ❌ Email: ${data.patientEmail} (expected: ${EXPECTED_EMAIL})`);
      } else {
        console.log(`   ❌ Phone: ${data.patientPhoneNumber} (expected: ${EXPECTED_PHONE})`);
        console.log(`   ✅ Email: ${data.patientEmail}`);
      }
    } else {
      console.log('❌ EXTRACTION FAILED - Neither field matched');
      console.log(`   Expected Phone: ${EXPECTED_PHONE}`);
      console.log(`   Actual Phone:   ${data.patientPhoneNumber}`);
      console.log(`   Expected Email: ${EXPECTED_EMAIL}`);
      console.log(`   Actual Email:   ${data.patientEmail}`);
    }
    
    console.log('\n' + '═'.repeat(80));
    console.log('\n📊 FULL EXTRACTED DATA:\n');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n' + '═'.repeat(80) + '\n');
    
    process.exit(phoneMatch && emailMatch ? 0 : 1);
    
  } catch (error) {
    console.error(`\n❌ Test failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

testExtraction();
