#!/usr/bin/env node

// Test script to SEED the database and verify orchestration
const API_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';

console.log(`Testing Raindrop DB Seeding at: ${API_URL}\n`);

async function runTest() {
    // 1. Seed Database
    console.log('1. Seeding Database...');
    try {
        const seedResponse = await fetch(`${API_URL}/seed`, { method: 'POST' });
        console.log(`   Status: ${seedResponse.status}`);
        const seedResult = await seedResponse.json();
        console.log(`   Response:`, seedResult, '\n');
    } catch (e) {
        console.error('   Seed failed:', e.message);
        return;
    }

    // 2. Test Orchestration (Cardiology)
    console.log('2. Testing Orchestration (Cardiology)...');
    try {
        const response = await fetch(`${API_URL}/orchestrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientName: "Test Patient",
                referralReason: "Patient complains of chest pain and palpitations",
                insuranceProvider: "Blue Cross"
            })
        });

        console.log(`   Status: ${response.status}`);
        const result = await response.json();
        console.log(`   Response:`, JSON.stringify(result, null, 2), '\n');

        if (result.success && result.data.specialist === 'Cardiologist') {
            console.log('   ✅ Correctly identified Cardiologist');
        } else {
            console.log('   ❌ Failed to identify Cardiologist');
        }
    } catch (e) {
        console.error('   Orchestration failed:', e.message);
    }

    // 3. Test Orchestration (Dermatology)
    console.log('3. Testing Orchestration (Dermatology)...');
    try {
        const response = await fetch(`${API_URL}/orchestrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientName: "Test Patient 2",
                referralReason: "Severe skin rash and itching",
                insuranceProvider: "Aetna"
            })
        });

        console.log(`   Status: ${response.status}`);
        const result = await response.json();
        console.log(`   Response:`, JSON.stringify(result, null, 2), '\n');

        if (result.success && result.data.specialist === 'Dermatologist') {
            console.log('   ✅ Correctly identified Dermatologist');
        } else {
            console.log('   ❌ Failed to identify Dermatologist');
        }
    } catch (e) {
        console.error('   Orchestration failed:', e.message);
    }

    // 4. Test Orchestration (Neurologist)
    console.log('4. Testing Orchestration (Neurologist)...');
    try {
        const response = await fetch(`${API_URL}/orchestrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientName: "Test Patient 3",
                referralReason: "Chronic migraines and dizziness",
                insuranceProvider: "Cigna"
            })
        });

        console.log(`   Status: ${response.status}`);
        const result = await response.json();
        console.log(`   Response:`, JSON.stringify(result, null, 2), '\n');

        if (result.success && result.data.specialist === 'Neurologist') {
            console.log('   ✅ Correctly identified Neurologist');
        } else {
            console.log('   ❌ Failed to identify Neurologist');
        }
    } catch (e) {
        console.error('   Orchestration failed:', e.message);
    }
}

runTest();
