#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';
const PDF_FILE = path.join(__dirname, 'Medical Referral Document 3.pdf');

console.log('Testing Upload → Wait → Extract workflow\n');

async function testWithDelay() {
    let filename = '';

    // STEP 1: Upload
    console.log('1️⃣  Uploading PDF...');
    try {
        const fileBuffer = fs.readFileSync(PDF_FILE);
        const formData = new FormData();
        const blob = new Blob([fileBuffer], { type: 'application/pdf' });
        formData.append('file', blob, 'Medical Referral Document 3.pdf');

        const uploadResponse = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        const uploadResult = await uploadResponse.json();
        console.log(`   Status: ${uploadResponse.status}`);
        console.log(`   Response:`, JSON.stringify(uploadResult, null, 2));

        filename = uploadResult.filename || 'Medical Referral Document 3.pdf';
        console.log('   ✅ Upload complete\n');
    } catch (error) {
        console.error('   ❌ Upload failed:', error.message);
        return;
    }

    // STEP 2: Wait for indexing
    console.log('2️⃣  Waiting 5 seconds for PDF indexing...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('   ⏰ Wait complete\n');

    // STEP 3: Extract
    console.log('3️⃣  Extracting patient data with AI...');
    try {
        const extractResponse = await fetch(`${API_URL}/extract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename })
        });

        const extractResult = await extractResponse.json();
        console.log(`   Status: ${extractResponse.status}`);
        console.log(`   Response:`, JSON.stringify(extractResult, null, 2));

        if (extractResult.patientName) {
            console.log('\n   ✅ Extraction successful!');
            console.log(`      Patient: ${extractResult.patientName}`);
            console.log(`      DOB: ${extractResult.dateOfBirth || 'N/A'}`);
            console.log(`      Condition: ${extractResult.referralReason}`);
            console.log(`      Insurance: ${extractResult.insuranceProvider}`);
        } else {
            console.log('\n   ⚠️  Extraction returned unexpected format');
        }
    } catch (error) {
        console.error('   ❌ Extraction failed:', error.message);
    }
}

testWithDelay();
