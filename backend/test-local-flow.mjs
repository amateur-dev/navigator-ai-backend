#!/usr/bin/env node

/**
 * Test script to verify the local development server flow:
 * 1. Seed/clear the database
 * 2. Call /orchestrate with test referral data
 * 3. Call /referrals to verify the new referral appears
 */

const BASE_URL = 'http://localhost:3000';

async function testLocalFlow() {
    console.log('🧪 Testing Local Development Server Flow\n');

    try {
        // Step 1: Seed (clear) the database
        console.log('1️⃣  Seeding database...');
        const seedResponse = await fetch(`${BASE_URL}/seed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!seedResponse.ok) {
            throw new Error(`Seed failed: ${seedResponse.status}`);
        }

        const seedData = await seedResponse.json();
        console.log('✅ Database seeded:', seedData.message);

        // Step 2: Create a test referral via orchestrate
        console.log('\n2️⃣  Creating test referral...');
        const testReferralData = {
            referralData: {
                patientFirstName: 'Jason',
                patientLastName: 'Miller',
                patientEmail: 'jason.miller@email.com',
                age: 45,
                specialty: 'Cardiology',
                payer: 'Anthem Blue Cross',
                plan: 'Blue Cross PPO',
                urgency: 'urgent',
                appointmentDate: null,
                referralDate: new Date().toISOString(),
                providerName: 'Dr. James Mitchell',
                facilityName: 'Downtown Medical Center',
                reason: 'Suspected ADHD and increasing anxiety behaviors'
            }
        };

        const orchestrateResponse = await fetch(`${BASE_URL}/orchestrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testReferralData)
        });

        if (!orchestrateResponse.ok) {
            const errorData = await orchestrateResponse.json();
            throw new Error(`Orchestrate failed: ${JSON.stringify(errorData)}`);
        }

        const orchestrateData = await orchestrateResponse.json();
        console.log('✅ Referral created:', orchestrateData.data.referralId);

        // Step 3: Verify the referral appears in the list
        console.log('\n3️⃣  Fetching referrals list...');
        const referralsResponse = await fetch(`${BASE_URL}/referrals`);

        if (!referralsResponse.ok) {
            throw new Error(`Referrals fetch failed: ${referralsResponse.status}`);
        }

        const referralsData = await referralsResponse.json();
        const referralsList = referralsData.data.referrals;

        console.log(`✅ Found ${referralsList.length} referral(s)`);

        // Step 4: Verify the new referral is in the list
        const jasonReferral = referralsList.find(r =>
            r.patientFirstName === 'Jason' && r.patientLastName === 'Miller'
        );

        if (jasonReferral) {
            console.log('\n✅ SUCCESS! Jason Miller referral found in list:');
            console.log(JSON.stringify(jasonReferral, null, 2));
        } else {
            console.log('\n❌ FAILURE! Jason Miller referral NOT found in list');
            console.log('Available referrals:', referralsList.map(r => `${r.patientFirstName} ${r.patientLastName}`));
            process.exit(1);
        }

        console.log('\n🎉 All tests passed!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run the test
testLocalFlow();
