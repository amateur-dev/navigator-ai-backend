#!/usr/bin/env node

/**
 * Test script to validate the /extract endpoint response format
 * Verifies that the response matches the documented API specification
 */

const BASE_URL = 'http://localhost:3000';

async function testExtractEndpoint() {
    console.log('🧪 Testing Extract Endpoint Response Format\n');

    try {
        // Test with a mock document ID
        const testDocumentId = 'doc-test-12345';

        console.log('1️⃣  Calling /extract endpoint...');
        const extractResponse = await fetch(`${BASE_URL}/extract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: testDocumentId })
        });

        if (!extractResponse.ok) {
            throw new Error(`Extract failed: ${extractResponse.status}`);
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

        // Print the full response
        console.log('\n4️⃣  Full response structure:');
        console.log(JSON.stringify(extractData, null, 2));

        console.log('\n🎉 All validations passed!');
        console.log('✅ Extract endpoint meets API specification requirements');

    } catch (error) {
        console.error('\n❌ Validation failed:', error.message);
        process.exit(1);
    }
}

// Run the test
testExtractEndpoint();
