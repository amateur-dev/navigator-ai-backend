#!/usr/bin/env node

// Test script to verify PUBLIC Raindrop endpoints
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The public URL we just got from deployment
const API_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';

console.log(`Testing Raindrop Public API at: ${API_URL}\n`);

// Test 1: Ping
console.log('1. Testing /ping...');
try {
    const pingResponse = await fetch(`${API_URL}/ping`);
    console.log(`   Status: ${pingResponse.status}`);
    console.log(`   Response: ${await pingResponse.text()}\n`);
} catch (e) {
    console.error('   Ping failed:', e.message);
}

// Test 2: Upload
console.log('2. Testing /upload...');
let uploadResult;
try {
    const formData = new FormData();
    const pdfPath = path.join(__dirname, 'Medical Referral Document 1.pdf');
    const pdfBuffer = readFileSync(pdfPath);
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    formData.append('file', blob, 'Medical Referral Document 1.pdf');

    const uploadResponse = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
    });
    console.log(`   Status: ${uploadResponse.status}`);
    uploadResult = await uploadResponse.json();
    console.log(`   Response:`, uploadResult, '\n');
} catch (e) {
    console.error('   Upload failed:', e.message);
    // If upload fails, we can't really continue meaningfully, but we'll try extract with hardcoded filename
}

// Test 3: Extract
console.log('3. Testing /extract...');
let extractResult;
try {
    const extractResponse = await fetch(`${API_URL}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: 'Medical Referral Document 1.pdf' })
    });
    console.log(`   Status: ${extractResponse.status}`);
    extractResult = await extractResponse.json();
    console.log(`   Response:`, extractResult, '\n');
} catch (e) {
    console.error('   Extract failed:', e.message);
}

// Test 4: Orchestrate
if (extractResult) {
    console.log('4. Testing /orchestrate...');
    let orchestrateResult;
    try {
        const orchestrateResponse = await fetch(`${API_URL}/orchestrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientName: extractResult.patientName,
                referralReason: extractResult.referralReason,
                insuranceProvider: extractResult.insuranceProvider
            })
        });
        console.log(`   Status: ${orchestrateResponse.status}`);
        orchestrateResult = await orchestrateResponse.json();
        console.log(`   Response:`, orchestrateResult, '\n');

        // Test 5: Confirm
        if (orchestrateResult && orchestrateResult.availableSlots && orchestrateResult.availableSlots.length > 0) {
            console.log('5. Testing /confirm...');
            try {
                const confirmResponse = await fetch(`${API_URL}/confirm`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        patientName: extractResult.patientName,
                        slot: orchestrateResult.availableSlots[0]
                    })
                });
                console.log(`   Status: ${confirmResponse.status}`);
                const confirmResult = await confirmResponse.json();
                console.log(`   Response:`, confirmResult, '\n');
            } catch (e) {
                console.error('   Confirm failed:', e.message);
            }
        }
    } catch (e) {
        console.error('   Orchestrate failed:', e.message);
    }
}

console.log('✅ Raindrop verification completed!');
