
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';
const FILE_PATH = path.join(__dirname, 'Medical Referral Document 9 Clean.pdf');

async function runTest() {
    console.log('🚀 Starting End-to-End Test with Medical Referral Document 9 Clean.pdf');
    console.log(`📍 API URL: ${API_URL}`);

    // 1. Upload File
    console.log('\n1️⃣  Uploading Document...');
    if (!fs.existsSync(FILE_PATH)) {
        console.error(`❌ File not found: ${FILE_PATH}`);
        process.exit(1);
    }

    const fileBuffer = fs.readFileSync(FILE_PATH);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', blob, 'Medical Referral Document 9.pdf');

    let docId;
    try {
        const uploadRes = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        
        if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.statusText}`);
        const uploadData = await uploadRes.json();
        console.log('✅ Upload Success:', uploadData);
        docId = uploadData.id;
    } catch (e) {
        console.error('❌ Upload Error:', e);
        process.exit(1);
    }

    console.log('⏳ Waiting 15s for indexing...');
    await new Promise(resolve => setTimeout(resolve, 15000));

    // 2. Extract Data
    console.log(`\n2️⃣  Extracting Data for ID: ${docId}...`);
    let extractedData;
    try {
        const extractRes = await fetch(`${API_URL}/extract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: docId })
        });

        if (!extractRes.ok) throw new Error(`Extraction failed: ${extractRes.statusText}`);
        const extractResult = await extractRes.json();
        console.log('✅ Extraction Result:', JSON.stringify(extractResult, null, 2));
        
        extractedData = extractResult.data.extractedData;
        
        // Verify format (a)
        if (extractResult.success && extractResult.data && extractResult.data.extractedData) {
            console.log('✅ Format check passed');
        } else {
            console.error('❌ Format check failed');
        }

    } catch (e) {
        console.error('❌ Extraction Error:', e);
        process.exit(1);
    }

    // 3. Orchestrate (to save to DB)
    console.log('\n3️⃣  Orchestrating (Saving to DB)...');
    try {
        const orchestrationPayload = {
            patientName: `${extractedData.patientFirstName} ${extractedData.patientLastName}`,
            referralReason: extractedData.reason,
            insuranceProvider: extractedData.payer
        };
        console.log('   Payload:', orchestrationPayload);

        const orchRes = await fetch(`${API_URL}/orchestrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orchestrationPayload)
        });

        if (!orchRes.ok) throw new Error(`Orchestration failed: ${orchRes.statusText}`);
        const orchData = await orchRes.json();
        console.log('✅ Orchestration Success:', orchData);

    } catch (e) {
        console.error('❌ Orchestration Error:', e);
        process.exit(1);
    }

    // 4. Verify Referrals List
    console.log('\n4️⃣  Verifying Referrals List...');
    try {
        const listRes = await fetch(`${API_URL}/referrals`);
        if (!listRes.ok) throw new Error(`List failed: ${listRes.statusText}`);
        const listData = await listRes.json();
        
        console.log('✅ Referrals List:', JSON.stringify(listData, null, 2));

        const found = listData.data.referrals.find(r => 
            r.patientFirstName === extractedData.patientFirstName && 
            r.patientLastName === extractedData.patientLastName
        );

        if (found) {
            console.log(`\n✅ SUCCESS: Found patient ${found.patientFirstName} ${found.patientLastName} in the list!`);
        } else {
            console.error('\n❌ FAILURE: Patient not found in the list.');
        }

    } catch (e) {
        console.error('❌ List Error:', e);
    }
}

runTest();
