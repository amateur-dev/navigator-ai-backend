#!/usr/bin/env node

// Test script for local Express server
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:3000';

console.log('Testing Local Express API...\n');

// Test 1: Ping
console.log('1. Testing /ping...');
const pingResponse = await fetch(`${API_URL}/ping`);
console.log(`   Status: ${pingResponse.status}`);
console.log(`   Response: ${await pingResponse.text()}\n`);

// Test 2: Upload
console.log('2. Testing /upload...');
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
const uploadResult = await uploadResponse.json();
console.log(`   Response:`, uploadResult, '\n');

// Test 3: Extract
console.log('3. Testing /extract...');
const extractResponse = await fetch(`${API_URL}/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: 'Medical Referral Document 1.pdf' })
});
console.log(`   Status: ${extractResponse.status}`);
const extractResult = await extractResponse.json();
console.log(`   Response:`, extractResult, '\n');

// Test 4: Orchestrate
console.log('4. Testing /orchestrate...');
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
const orchestrateResult = await orchestrateResponse.json();
console.log(`   Response:`, orchestrateResult, '\n');

// Test 5: Confirm
console.log('5. Testing /confirm...');
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

console.log('✅ All tests completed!');
