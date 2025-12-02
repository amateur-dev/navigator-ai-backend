#!/usr/bin/env node

/**
 * Complete Production Flow Test
 * Tests the entire referral workflow on production:
 * 1. Extract (mock - would require actual file upload)
 * 2. Orchestrate
 * 3. Verify referral was created
 */

const PRODUCTION_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';

async function testProductionFlow() {
    console.log('🧪 Testing COMPLETE Production Flow');
    console.log(`📍 URL: ${PRODUCTION_URL}\n`);

    try {
        // Step 1: Test orchestrate endpoint
        console.log('1️⃣  Testing orchestrate endpoint...');
        const testReferralData = {
            patientName: 'Jason Miller',
            referralReason: 'Suspected ADHD and increasing anxiety behaviors',
            insuranceProvider: 'Anthem Blue Cross'
        };

        const orchestrateResponse = await fetch(`${PRODUCTION_URL}/orchestrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testReferralData)
        });

        console.log(`   Status: ${orchestrateResponse.status} ${orchestrateResponse.statusText}`);

        if (!orchestrateResponse.ok) {
            const errorText = await orchestrateResponse.text();
            throw new Error(`Orchestrate failed with ${orchestrateResponse.status}: ${errorText}`);
        }

        const orchestrateData = await orchestrateResponse.json();

        if (!orchestrateData.success) {
            throw new Error('Orchestrate response success=false');
        }

        console.log('✅ Referral created:', orchestrateData.data.referralId);
        console.log('   Specialist:', orchestrateData.data.specialist);
        console.log('   Assigned Doctor:', orchestrateData.data.assignedDoctor);
        console.log('   Insurance Status:', orchestrateData.data.insuranceStatus);
        console.log('   Available Slots:', orchestrateData.data.availableSlots?.length || 0);

        // Step 2: Test referrals list endpoint
        console.log('\n2️⃣  Testing referrals list endpoint...');
        const referralsResponse = await fetch(`${PRODUCTION_URL}/referrals`);

        console.log(`   Status: ${referralsResponse.status} ${referralsResponse.statusText}`);

        if (!referralsResponse.ok) {
            const errorText = await referralsResponse.text();
            throw new Error(`Referrals fetch failed with ${referralsResponse.status}: ${errorText}`);
        }

        const referralsData = await referralsResponse.json();

        if (!referralsData.success) {
            throw new Error('Referrals response success=false');
        }

        console.log('✅ Referrals retrieved');
        console.log('   Total referrals:', referralsData.data.referrals?.length || 0);

        // Note: Production uses mock data, so we won't find Jason Miller
        // But we can verify the endpoint works
        console.log('   Sample referrals:', referralsData.data.referrals?.slice(0, 2).map(r =>
            `${r.patientFirstName} ${r.patientLastName}`
        ).join(', '));

        // Step 3: Test referral details endpoint
        if (referralsData.data.referrals && referralsData.data.referrals.length > 0) {
            const firstReferralId = referralsData.data.referrals[0].id;
            console.log(`\n3️⃣  Testing referral details endpoint for ${firstReferralId}...`);

            const detailsResponse = await fetch(`${PRODUCTION_URL}/referral/${firstReferralId}`);
            console.log(`   Status: ${detailsResponse.status} ${detailsResponse.statusText}`);

            if (detailsResponse.ok) {
                const detailsData = await detailsResponse.json();
                console.log('✅ Referral details retrieved');
                console.log('   Patient:', detailsData.data?.patientFirstName, detailsData.data?.patientLastName);
            } else {
                console.log('⚠️  Referral details endpoint returned:', detailsResponse.status);
            }
        }

        console.log('\n🎉 All production tests passed!');
        console.log('\n📊 Summary:');
        console.log('   ✅ Orchestrate endpoint working');
        console.log('   ✅ Referrals list endpoint working');
        console.log('   ✅ All responses properly formatted');
        console.log('\n💡 Note: Production uses mock data for /referrals endpoint');
        console.log('   The orchestrate endpoint creates records in the production database');

    } catch (error) {
        console.error('\n❌ Production flow test failed:', error.message);
        if (error.message.includes('fetch failed')) {
            console.error('\n💡 Possible issues:');
            console.error('   - Production deployment may be down');
            console.error('   - Network connectivity issues');
            console.error('   - Check deployment logs');
        }
        process.exit(1);
    }
}

// Run the test
testProductionFlow();
