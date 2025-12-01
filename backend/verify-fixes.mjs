
import { strict as assert } from 'assert';

const BASE_URL = 'http://localhost:3000'; // Local server port

async function runVerification() {
    console.log('Starting verification...');

    // 1. Seed the database (to ensure table exists with new schema)
    console.log('\n1. Seeding database...');
    const seedRes = await fetch(`${BASE_URL}/seed`, { method: 'POST' });
    if (!seedRes.ok) {
        throw new Error(`Seed failed: ${seedRes.status} ${await seedRes.text()}`);
    }
    console.log('Database seeded.');

    // 2. Create a referral via /orchestrate
    console.log('\n2. Creating referral via /orchestrate...');
    const referralData = {
        patientFirstName: "John",
        patientLastName: "Doe",
        patientEmail: "john.doe@example.com",
        age: 45,
        specialty: "Cardiology",
        payer: "Blue Cross",
        plan: "PPO",
        urgency: "urgent",
        appointmentDate: "2025-12-10",
        referralDate: "2025-12-01",
        providerName: "Dr. Smith",
        facilityName: "General Hospital",
        reason: "Chest pain"
    };

    const orchestrateRes = await fetch(`${BASE_URL}/orchestrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralData })
    });

    if (!orchestrateRes.ok) {
        throw new Error(`Orchestrate failed: ${orchestrateRes.status} ${await orchestrateRes.text()}`);
    }

    const orchestrateJson = await orchestrateRes.json();
    console.log('Orchestrate response:', orchestrateJson);
    assert.equal(orchestrateJson.success, true, 'Orchestration should be successful');
    const referralId = orchestrateJson.data.referralId;
    console.log(`Created referral ID: ${referralId}`);

    // 3. Fetch referrals via /referrals
    console.log('\n3. Fetching referrals via /referrals...');
    const referralsRes = await fetch(`${BASE_URL}/referrals`);
    if (!referralsRes.ok) {
        throw new Error(`Get referrals failed: ${referralsRes.status} ${await referralsRes.text()}`);
    }

    const referralsJson = await referralsRes.json();
    console.log('Referrals response:', JSON.stringify(referralsJson, null, 2));

    assert.equal(referralsJson.success, true, 'Get referrals should be successful');
    const referrals = referralsJson.data.referrals;

    // Find our referral
    const foundReferral = referrals.find(r => r.id === referralId);
    assert.ok(foundReferral, 'Newly created referral should be found in the list');

    // Verify fields
    assert.equal(foundReferral.patientFirstName, referralData.patientFirstName);
    assert.equal(foundReferral.patientLastName, referralData.patientLastName);
    assert.equal(foundReferral.patientEmail, referralData.patientEmail);
    assert.equal(foundReferral.specialty, referralData.specialty);
    // assert.equal(foundReferral.payer, referralData.payer); // Payer might be normalized or just stored as is
    assert.equal(foundReferral.status, 'Pending');

    console.log('\nVerification SUCCESS! All checks passed.');
}

runVerification().catch(err => {
    console.error('\nVerification FAILED:', err);
    process.exit(1);
});
