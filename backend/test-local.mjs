#!/usr/bin/env node

// Test script for local Express server
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:3000';

console.log('Testing Local Express API...\n');

async function runTests() {
    try {
        // Test 1: Ping
        console.log('1. Testing /ping...');
        const pingResponse = await fetch(`${API_URL}/ping`);
        console.log(`   Status: ${pingResponse.status}`);
        console.log(`   Response: ${await pingResponse.text()}\n`);

        // Test 2: Upload
        console.log('2. Testing /upload...');
        const formData = new FormData();
        // Use a dummy PDF file or create one if it doesn't exist
        const pdfPath = path.join(__dirname, 'Medical Referral Document 1.pdf');

        try {
            const pdfBuffer = readFileSync(pdfPath);
            const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
            formData.append('file', blob, 'Medical Referral Document 1.pdf');

            const uploadResponse = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData
            });
            console.log(`   Status: ${uploadResponse.status}`);
            const uploadResult = await uploadResponse.json();
            console.log(`   Response: Success=${uploadResult.success}`);
            if (uploadResult.data && uploadResult.data.extractedData) {
                console.log(`   Extracted Patient: ${uploadResult.data.extractedData.patientFirstName} ${uploadResult.data.extractedData.patientLastName}`);
            }
            console.log('');
        } catch (e) {
            console.log(`   Skipping upload test (file not found): ${e.message}\n`);
        }

        // Test 3: Orchestrate
        console.log('3. Testing /orchestrate...');
        const orchestrateResponse = await fetch(`${API_URL}/orchestrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                documentId: "doc-12345678",
                referralData: {
                    patientFirstName: "Sarah",
                    patientLastName: "Johnson"
                }
            })
        });
        console.log(`   Status: ${orchestrateResponse.status}`);
        const orchestrateResult = await orchestrateResponse.json();
        console.log(`   Response: Success=${orchestrateResult.success}`);
        if (orchestrateResult.data) {
            console.log(`   Referral ID: ${orchestrateResult.data.referralId}`);
            console.log(`   Status: ${orchestrateResult.data.status}`);
        }
        console.log('');

        // Test 4: Get All Referrals
        console.log('4. Testing /referrals...');
        const referralsResponse = await fetch(`${API_URL}/referrals`);
        console.log(`   Status: ${referralsResponse.status}`);
        const referralsResult = await referralsResponse.json();
        console.log(`   Response: Success=${referralsResult.success}`);
        if (referralsResult.data && referralsResult.data.referrals) {
            console.log(`   Count: ${referralsResult.data.referrals.length}`);
        }
        console.log('');

        // Test 5: Get Referral Details
        console.log('5. Testing /referral/ref-001...');
        const referralResponse = await fetch(`${API_URL}/referral/ref-001`);
        console.log(`   Status: ${referralResponse.status}`);
        const referralResult = await referralResponse.json();
        console.log(`   Response: Success=${referralResult.success}`);
        if (referralResult.data) {
            console.log(`   Patient: ${referralResult.data.patientFirstName} ${referralResult.data.patientLastName}`);
        }
        console.log('');

        // Test 6: Get Referral Logs
        console.log('6. Testing /referral/ref-001/logs...');
        const logsResponse = await fetch(`${API_URL}/referral/ref-001/logs`);
        console.log(`   Status: ${logsResponse.status}`);
        const logsResult = await logsResponse.json();
        console.log(`   Response: Success=${logsResult.success}`);
        if (logsResult.data && logsResult.data.logs) {
            console.log(`   Log Count: ${logsResult.data.logs.length}`);
        }
        console.log('');

        console.log('✅ All tests completed!');
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

runTests();
