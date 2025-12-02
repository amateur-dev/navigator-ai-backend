#!/usr/bin/env node

/**
 * Retry extraction for the already uploaded document
 * with retry logic and delays for indexing
 */

const PRODUCTION_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';
const DOCUMENT_ID = 'doc-1764599319900-eqzxlr09ocu'; // From previous upload

// Expected extracted data for Sarah Johnson
const EXPECTED_DATA = {
    patientFirstName: "Sarah",
    patientLastName: "Johnson",
    patientEmail: "sarah.johnson@email.com",
    age: 58,
    specialty: "Cardiology",
    payer: "Blue Cross Blue Shield",
    plan: "Blue Cross PPO Plus",
    urgency: "urgent",
    appointmentDate: null,
    referralDate: "2025-11-10T14:00:00Z",
    providerName: "Dr. James Mitchell",
    facilityName: "Downtown Medical Center",
    reason: "Chest pain and irregular heartbeat"
};

async function retryExtraction() {
    console.log('🔄 Retrying extraction for document:', DOCUMENT_ID);
    console.log('📍 Production URL:', PRODUCTION_URL);
    console.log('\n');

    const maxRetries = 5;
    const delayBetweenRetries = 5000; // 5 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt}/${maxRetries}...`);

            const extractResponse = await fetch(`${PRODUCTION_URL}/extract`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: DOCUMENT_ID })
            });

            console.log(`   Status: ${extractResponse.status} ${extractResponse.statusText}`);

            if (!extractResponse.ok) {
                const errorData = await extractResponse.json();
                console.log('   Error:', JSON.stringify(errorData, null, 2));

                if (attempt < maxRetries) {
                    console.log(`   Waiting ${delayBetweenRetries / 1000}s before retry...\n`);
                    await new Promise(resolve => setTimeout(resolve, delayBetweenRetries));
                    continue;
                } else {
                    throw new Error(`Extract failed after ${maxRetries} attempts`);
                }
            }

            const extractData = await extractResponse.json();
            console.log('✅ Extraction successful!\n');

            // Validate the structure
            if (!extractData.success || !extractData.data || !extractData.data.extractedData) {
                console.log('Full response:', JSON.stringify(extractData, null, 2));
                throw new Error('Unexpected response structure');
            }

            // Validate extracted data
            console.log('VALIDATING EXTRACTED DATA:');
            console.log('='.repeat(80));

            const extracted = extractData.data.extractedData;
            let allFieldsMatch = true;
            const mismatches = [];

            for (const [key, expectedValue] of Object.entries(EXPECTED_DATA)) {
                const actualValue = extracted[key];
                const matches = JSON.stringify(actualValue) === JSON.stringify(expectedValue);

                const status = matches ? '✅' : '❌';
                console.log(`${status} ${key}:`);
                console.log(`   Expected: ${JSON.stringify(expectedValue)}`);
                console.log(`   Actual:   ${JSON.stringify(actualValue)}`);

                if (!matches) {
                    allFieldsMatch = false;
                    mismatches.push({ field: key, expected: expectedValue, actual: actualValue });
                }
            }

            console.log('\n' + '='.repeat(80));

            if (!allFieldsMatch) {
                console.log('\n⚠️  SOME FIELDS DO NOT MATCH:');
                mismatches.forEach(m => {
                    console.log(`   - ${m.field}: expected ${JSON.stringify(m.expected)}, got ${JSON.stringify(m.actual)}`);
                });
            } else {
                console.log('\n✅ ALL FIELDS MATCH EXPECTED VALUES!');
            }

            console.log('\n📋 FULL EXTRACTED DATA:');
            console.log(JSON.stringify(extracted, null, 2));

            // Now orchestrate
            console.log('\n' + '='.repeat(80));
            console.log('CREATING REFERRAL VIA ORCHESTRATE...');
            console.log('='.repeat(80) + '\n');

            const orchestrateResponse = await fetch(`${PRODUCTION_URL}/orchestrate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    referralData: extracted
                })
            });

            console.log(`Status: ${orchestrateResponse.status} ${orchestrateResponse.statusText}`);

            if (!orchestrateResponse.ok) {
                const errorText = await orchestrateResponse.text();
                throw new Error(`Orchestrate failed: ${errorText}`);
            }

            const orchestrateData = await orchestrateResponse.json();
            console.log('✅ Referral created!');
            console.log(`   Referral ID: ${orchestrateData.data.referralId}`);
            console.log(`   Status: ${orchestrateData.data.status}`);
            console.log(`   Specialist: ${orchestrateData.data.specialist || 'N/A'}`);
            console.log(`   Assigned Doctor: ${orchestrateData.data.assignedDoctor || 'N/A'}`);

            console.log('\n🎉 TEST COMPLETED SUCCESSFULLY!');
            return;

        } catch (error) {
            if (attempt === maxRetries) {
                console.error('\n❌ FINAL FAILURE:', error.message);
                process.exit(1);
            }
        }
    }
}

retryExtraction();
