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

        // 2. Reset / Seed DB to known state
        console.log('\n2️⃣  Seeding database to known clean state...');
        const seedRes = await fetch(`${API_URL}/seed`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clearReferralsOnly: true }) });
        if (!seedRes.ok) {
            throw new Error(`Seed failed: ${seedRes.status} ${await seedRes.text()}`);
        }
        const seedData = await seedRes.json();
        console.log('   ✅ Seed response:', seedData.message || JSON.stringify(seedData));

        // 3. Upload Document
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
        
        // 6. Orchestrate Workflow
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

        // 7. Verify referrals listing and details
        const referralId = orchestrateData?.data?.referralId;
        if (!referralId) throw new Error('Missing referralId from orchestration');

        console.log('\n7️⃣  Fetching referrals list...');
        const listRes = await fetch(`${API_URL}/referrals`);
        if (!listRes.ok) throw new Error(`Referrals fetch failed: ${listRes.status}`);
        const listData = await listRes.json();
        const referrals = listData?.data?.referrals || [];
        if (!Array.isArray(referrals) || referrals.length === 0) throw new Error('Expected at least one referral in referrals list');

        // Validate that the referral we just created is present and matches expected details
        const foundRef = referrals.find(r => r.id === referralId || (r.patientFirstName === EXPECTED_DATA.patientFirstName && r.patientLastName === EXPECTED_DATA.patientLastName));
        if (!foundRef) {
            console.error('   ❌ Referral not found in referrals list');
            console.log('   Referrals snapshot:', JSON.stringify(referrals, null, 2));
            throw new Error('Created referral not present in referrals list');
        }

        // Check key fields from the list view
        if ((foundRef.patientFirstName || '').toLowerCase() !== EXPECTED_DATA.patientFirstName.toLowerCase()) throw new Error('Referrals list patientFirstName mismatch');
        if ((foundRef.patientLastName || '').toLowerCase() !== EXPECTED_DATA.patientLastName.toLowerCase()) throw new Error('Referrals list patientLastName mismatch');
        if ((foundRef.payer || '').toLowerCase() !== EXPECTED_DATA.payer.toLowerCase()) throw new Error('Referrals list payer mismatch');

        console.log('   ✅ Referrals list contains the created referral (count =', referrals.length + ')');

        console.log('\n8️⃣  Fetching referral details for', referralId);
        const detailRes = await fetch(`${API_URL}/referral/${referralId}`);
        if (!detailRes.ok) throw new Error(`Referral detail failed: ${detailRes.status} ${await detailRes.text()}`);
        const detailData = await detailRes.json();
        if (!detailData?.success) throw new Error('Referral detail response not successful');

        // Validate referral detail payload
        const detail = detailData.data;
        if (detail.id !== referralId) throw new Error(`Referral detail id mismatch: expected ${referralId}, got ${detail.id}`);
        if ((detail.patientFirstName || '').toLowerCase() !== EXPECTED_DATA.patientFirstName.toLowerCase()) throw new Error('Referral detail patientFirstName mismatch');
        if ((detail.patientLastName || '').toLowerCase() !== EXPECTED_DATA.patientLastName.toLowerCase()) throw new Error('Referral detail patientLastName mismatch');
        if ((detail.payer || '').toLowerCase() !== EXPECTED_DATA.payer.toLowerCase()) throw new Error('Referral detail payer mismatch');
        // Reason should match the extracted reason
        if (!detail.reason || !detail.reason.toLowerCase().includes(EXPECTED_DATA.reason.toLowerCase())) throw new Error('Referral detail reason mismatch');

        console.log('   ✅ Referral detail fetched and validated:', detail.id || 'no-id');

        console.log('\n9️⃣  Fetching referral logs...');
        const logsRes = await fetch(`${API_URL}/referral/${referralId}/logs`);
        if (!logsRes.ok) throw new Error(`Referral logs failed: ${logsRes.status}`);
        const logsData = await logsRes.json();
        if (!logsData?.success) throw new Error('Referral logs response not successful');
        console.log('   ✅ Referral logs OK (entries =', (logsData.data?.logs || []).length + ')');

        // 10. Send confirmation (demo) for patient
        console.log('\n🔟  Sending confirmation (demo) for the referral...');
        const confirmationBody = {
            referralId: referralId,
            patientName: `${extractedData.patientFirstName} ${extractedData.patientLastName}`,
            patientEmail: extractedData.patientEmail || 'patient@example.com',
            patientPhone: extractedData.patientPhoneNumber || '+1-555-555-5555',
            doctorName: orchestrateData?.data?.assignedDoctor || 'Dr. Unknown',
            specialty: orchestrateData?.data?.specialist || extractedData.specialty || 'General Practice',
            appointmentDate: null,
            appointmentTime: null,
            facilityName: 'Downtown Medical Center',
            facilityAddress: '123 Main St'
        };

        const confirmRes = await fetch(`${API_URL}/confirm`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(confirmationBody)
        });
        if (!confirmRes.ok) throw new Error(`Confirm failed: ${confirmRes.status} ${await confirmRes.text()}`);
        const confirmData = await confirmRes.json();
        if (!confirmData?.success || !confirmData?.confirmationSent) throw new Error('Confirm endpoint failed to produce expected confirmation');
        console.log('   ✅ Confirmation demo succeeded');

        // 11. Metrics
        console.log('\n📈 Fetching metrics...');
        const metricsRes = await fetch(`${API_URL}/metrics`);
        if (!metricsRes.ok) throw new Error(`Metrics failed: ${metricsRes.status} ${await metricsRes.text()}`);
        const metricsData = await metricsRes.json();
        if (!metricsData?.success || !metricsData?.data) throw new Error('Invalid metrics response');
        console.log('   ✅ Metrics OK');

        // 12. Basic API routes
        console.log('\n🔬 Testing simple API endpoints...');
        const helloRes = await fetch(`${API_URL}/api/hello`);
        if (!helloRes.ok) throw new Error('/api/hello failed');
        const helloData = await helloRes.json();
        if (helloData?.message !== 'Hello from Hono!') throw new Error('Unexpected /api/hello message');
        console.log('   ✅ /api/hello OK');

        const nameHelloRes = await fetch(`${API_URL}/api/hello/Alice`);
        if (!nameHelloRes.ok) throw new Error('/api/hello/:name failed');
        const nameHello = await nameHelloRes.json();
        if (!nameHello?.message?.includes('Alice')) throw new Error('Unexpected /api/hello/:name response');
        console.log('   ✅ /api/hello/:name OK');

        const echoBody = { foo: 'bar', number: 42 };
        const echoRes = await fetch(`${API_URL}/api/echo`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(echoBody) });
        if (!echoRes.ok) throw new Error('/api/echo failed');
        const echoData = await echoRes.json();
        if (!echoData?.received || JSON.stringify(echoData.received) !== JSON.stringify(echoBody)) throw new Error('/api/echo response mismatch');
        console.log('   ✅ /api/echo OK');

        const configRes = await fetch(`${API_URL}/api/config`);
        if (!configRes.ok) throw new Error('/api/config failed');
        const configData = await configRes.json();
        if (!configData) throw new Error('/api/config returned invalid response');
        console.log('   ✅ /api/config OK');

        console.log('\n✅✅✅ E2E TEST COMPLETED SUCCESSFULLY ✅✅✅');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        process.exit(1);
    }
}

runE2ETest();
