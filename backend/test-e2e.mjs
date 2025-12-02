import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production API URL
const API_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';
const TEST_FILE = 'Medical Referral Document 9.pdf';

async function runE2ETest() {
    console.log('🚀 Starting E2E Production Test with Medical Referral Document 9...\n');

    try {
        // 1. Health Check
        console.log('1️⃣  Testing Health & Ping...');
        const pingRes = await fetch(`${API_URL}/ping`);
        if (pingRes.status !== 200) throw new Error(`Ping failed: ${pingRes.status}`);
        console.log('   ✅ Ping successful');

        const healthRes = await fetch(`${API_URL}/health`);
        if (healthRes.status !== 200) throw new Error(`Health failed: ${healthRes.status}`);
        console.log('   ✅ Health check successful\n');

        // 2. Upload Document
        console.log(`2️⃣  Uploading ${TEST_FILE}...`);
        const formData = new FormData();
        const pdfPath = path.join(__dirname, TEST_FILE);
        const pdfBuffer = readFileSync(pdfPath);
        const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
        formData.append('file', blob, TEST_FILE);

        const uploadRes = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!uploadRes.ok) {
            throw new Error(`Upload failed: ${uploadRes.status} ${await uploadRes.text()}`);
        }

        const uploadData = await uploadRes.json();
        console.log('   ✅ Upload successful');
        console.log(`   📄 Document ID: ${uploadData.id}\n`);

        // 3. Extract Data
        console.log('3️⃣  Extracting Data...');
        const extractRes = await fetch(`${API_URL}/extract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: uploadData.id })
        });

        if (!extractRes.ok) {
            throw new Error(`Extraction failed: ${extractRes.status} ${await extractRes.text()}`);
        }

        const extractResult = await extractRes.json();
        const extractedData = extractResult.data.extractedData;
        console.log('   ✅ Extraction successful');
        console.log('   📊 Extracted Data:', JSON.stringify(extractedData, null, 2));

        // Verify extracted data against expected values for Document 9
        console.log('   🔍 Validating Extracted Data...');
        const EXPECTED_DATA = {
            patientFirstName: 'Jason',
            patientLastName: 'Miller',
            age: 10,
            specialty: 'Psychiatrist',
            payer: 'Anthem Blue Cross',
            reason: 'Suspected ADHD and increasing anxiety behaviors'
        };

        const errors = [];
        for (const [key, expected] of Object.entries(EXPECTED_DATA)) {
            const actual = extractedData[key];
            // Flexible string matching (case-insensitive, substring)
            const isMatch = typeof actual === 'string' && typeof expected === 'string'
                ? actual.toLowerCase().includes(expected.toLowerCase()) || expected.toLowerCase().includes(actual.toLowerCase())
                : actual === expected;
            
            if (!isMatch) {
                errors.push(`Mismatch in ${key}: expected "${expected}", got "${actual}"`);
            }
        }

        if (errors.length > 0) {
            console.error('   ❌ Validation Errors:', errors);
            throw new Error('Data validation failed');
        }
        console.log('   ✅ Data validation passed');
        
        // 4. Orchestrate Workflow
        console.log('\n4️⃣  Orchestrating Referral...');
        const orchestrateRes = await fetch(`${API_URL}/orchestrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientName: `${extractedData.patientFirstName} ${extractedData.patientLastName}`,
                referralReason: extractedData.reason,
                insuranceProvider: extractedData.payer
            })
        });

        if (!orchestrateRes.ok) {
            throw new Error(`Orchestration failed: ${orchestrateRes.status} ${await orchestrateRes.text()}`);
        }

        const orchestrateData = await orchestrateRes.json();
        console.log('   ✅ Orchestration successful');
        console.log('   🎉 Referral Created:', JSON.stringify(orchestrateData, null, 2));

        console.log('\n✅✅✅ E2E TEST COMPLETED SUCCESSFULLY ✅✅✅');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        process.exit(1);
    }
}

runE2ETest();
