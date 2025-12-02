#!/usr/bin/env node

/**
 * Production Deployment Test Script
 * Tests the /extract endpoint on Raindrop production deployment
 */

const PRODUCTION_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';

async function testProductionExtract() {
    console.log('🧪 Testing PRODUCTION Extract Endpoint');
    console.log(`📍 URL: ${PRODUCTION_URL}/extract\n`);

    try {
        // Test with a mock document ID
        const testDocumentId = 'doc-prod-test-' + Date.now();

        console.log('1️⃣  Calling /extract endpoint on production...');
        const extractResponse = await fetch(`${PRODUCTION_URL}/extract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: testDocumentId })
        });

        console.log(`   Status: ${extractResponse.status} ${extractResponse.statusText}`);

        if (!extractResponse.ok) {
            const errorText = await extractResponse.text();
            throw new Error(`Extract failed with ${extractResponse.status}: ${errorText}`);
        }

        const extractData = await extractResponse.json();
        console.log('✅ Extract response received\n');

        // Validate response structure
        console.log('2️⃣  Validating response structure...');

        const requiredFields = ['success', 'data', 'message'];
        const missingFields = requiredFields.filter(field => !(field in extractData));

        if (missingFields.length > 0) {
            throw new Error(`Missing required top-level fields: ${missingFields.join(', ')}`);
        }
        console.log('✅ Top-level fields present: success, data, message');

        // Validate data object
        const requiredDataFields = ['extractedData', 'confidence', 'documentId', 'needsReview', 'warnings'];
        const missingDataFields = requiredDataFields.filter(field => !(field in extractData.data));

        if (missingDataFields.length > 0) {
            throw new Error(`Missing required data fields: ${missingDataFields.join(', ')}`);
        }
        console.log('✅ Data fields present: extractedData, confidence, documentId, needsReview, warnings');

        // Validate extractedData structure
        const requiredExtractedFields = [
            'patientFirstName', 'patientLastName', 'patientEmail', 'age',
            'specialty', 'payer', 'plan', 'urgency', 'appointmentDate',
            'referralDate', 'providerName', 'facilityName', 'reason'
        ];

        const missingExtractedFields = requiredExtractedFields.filter(
            field => !(field in extractData.data.extractedData)
        );

        if (missingExtractedFields.length > 0) {
            throw new Error(`Missing extracted data fields: ${missingExtractedFields.join(', ')}`);
        }
        console.log('✅ All extracted data fields present');

        // Validate data types
        console.log('\n3️⃣  Validating data types...');

        if (typeof extractData.success !== 'boolean') {
            throw new Error('success must be a boolean');
        }

        if (typeof extractData.data.confidence !== 'number') {
            throw new Error('confidence must be a number');
        }

        if (!Array.isArray(extractData.data.warnings)) {
            throw new Error('warnings must be an array');
        }

        console.log('✅ Data types are correct');

        // Print sample response
        console.log('\n4️⃣  Sample response structure:');
        console.log(JSON.stringify({
            success: extractData.success,
            data: {
                extractedData: {
                    patientFirstName: extractData.data.extractedData.patientFirstName,
                    patientLastName: extractData.data.extractedData.patientLastName,
                    specialty: extractData.data.extractedData.specialty,
                    '...': '(11 more fields)'
                },
                confidence: extractData.data.confidence,
                documentId: extractData.data.documentId,
                needsReview: extractData.data.needsReview,
                warnings: extractData.data.warnings
            },
            message: extractData.message
        }, null, 2));

        console.log('\n🎉 Production extract endpoint validation passed!');
        console.log('✅ Response format matches API specification');

    } catch (error) {
        console.error('\n❌ Production test failed:', error.message);
        if (error.message.includes('fetch failed')) {
            console.error('\n💡 Possible issues:');
            console.error('   - Production deployment may be down');
            console.error('   - Network connectivity issues');
            console.error('   - CORS configuration needed');
        }
        process.exit(1);
    }
}

// Run the test
testProductionExtract();
