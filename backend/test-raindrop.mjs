#!/usr/bin/env node

// Simple test script to verify endpoints work locally
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://api-01kad03012wm28t8kswtn123q1.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';

console.log('Testing Raindrop API endpoints...\n');

// Test 1: Ping
console.log('1. Testing /ping...');
const pingResponse = await fetch(`${API_URL}/ping`);
console.log(`   Status: ${pingResponse.status}`);
console.log(`   Response: ${await pingResponse.text()}\n`);

// Test 2: Health
console.log('2. Testing /health...');
const healthResponse = await fetch(`${API_URL}/health`);
console.log(`   Status: ${healthResponse.status}`);
console.log(`   Response: ${await healthResponse.text()}\n`);

// Test 3: Upload (if ping works)
if (pingResponse.status === 200) {
    console.log('3. Testing /upload...');
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
    console.log(`   Response: ${await uploadResponse.text()}\n`);
}
