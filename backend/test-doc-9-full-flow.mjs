
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';
const FILE_PATH = path.join(__dirname, 'Medical Referral Document 9.pdf');
const LOG_FILE = path.join(__dirname, 'test-flow-log.txt');

// Clear log file
fs.writeFileSync(LOG_FILE, `TEST LOG - ${new Date().toISOString()}\n\n`);

function log(message, data = null) {
    const timestamp = new Date().toISOString();
    let logEntry = `[${timestamp}] ${message}\n`;
    if (data) {
        logEntry += JSON.stringify(data, null, 2) + '\n';
    }
    logEntry += '-'.repeat(80) + '\n';
    
    console.log(message);
    if (data) console.log(JSON.stringify(data, null, 2));
    
    fs.appendFileSync(LOG_FILE, logEntry);
}

async function runTest() {
    log('🚀 Starting End-to-End Test with Medical Referral Document 9.pdf');
    log(`📍 API URL: ${API_URL}`);

    // 1. Upload File
    log('\n1️⃣  Uploading Document...');
    if (!fs.existsSync(FILE_PATH)) {
        log(`❌ File not found: ${FILE_PATH}`);
        process.exit(1);
    }

    const fileBuffer = fs.readFileSync(FILE_PATH);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', blob, 'Medical Referral Document 9.pdf');

    let docId;
    try {
        log(`REQUEST: POST ${API_URL}/upload (Multipart/form-data)`);
        const uploadRes = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        
        const uploadData = await uploadRes.json();
        log(`RESPONSE: ${uploadRes.status} ${uploadRes.statusText}`, uploadData);
        
        if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.statusText}`);
        docId = uploadData.id;
    } catch (e) {
        log('❌ Upload Error', e.message);
        process.exit(1);
    }

    // 2. Extract Data
    log(`\n2️⃣  Extracting Data for ID: ${docId}...`);
    let extractedData;
    try {
        const extractPayload = { id: docId };
        log(`REQUEST: POST ${API_URL}/extract`, extractPayload);
        
        const extractRes = await fetch(`${API_URL}/extract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(extractPayload)
        });

        const extractResult = await extractRes.json();
        log(`RESPONSE: ${extractRes.status} ${extractRes.statusText}`, extractResult);

        if (!extractRes.ok) throw new Error(`Extraction failed: ${extractRes.statusText}`);
        
        extractedData = extractResult.data.extractedData;

    } catch (e) {
        log('❌ Extraction Error', e.message);
        process.exit(1);
    }

    // 3. Orchestrate (to save to DB)
    log('\n3️⃣  Orchestrating (Saving to DB)...');
    let referralId;
    try {
        const orchestrationPayload = {
            patientName: `${extractedData.patientFirstName} ${extractedData.patientLastName}`,
            referralReason: extractedData.reason,
            insuranceProvider: extractedData.payer
        };
        log(`REQUEST: POST ${API_URL}/orchestrate`, orchestrationPayload);

        const orchRes = await fetch(`${API_URL}/orchestrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orchestrationPayload)
        });

        const orchData = await orchRes.json();
        log(`RESPONSE: ${orchRes.status} ${orchRes.statusText}`, orchData);

        if (!orchRes.ok) throw new Error(`Orchestration failed: ${orchRes.statusText}`);
        referralId = orchData.data.referralId;

    } catch (e) {
        log('❌ Orchestration Error', e.message);
        process.exit(1);
    }

    // 4. Verify Referrals List
    log('\n4️⃣  Verifying Referrals List...');
    try {
        log(`REQUEST: GET ${API_URL}/referrals`);
        const listRes = await fetch(`${API_URL}/referrals`);
        const listData = await listRes.json();
        log(`RESPONSE: ${listRes.status} ${listRes.statusText}`, listData);
        
        if (!listRes.ok) throw new Error(`List failed: ${listRes.statusText}`);

        const found = listData.data.referrals.find(r => r.id === referralId);

        if (found) {
            log(`\n✅ SUCCESS: Found new referral in the list!`, found);
        } else {
            log('\n❌ FAILURE: New referral not found in the list.');
        }

    } catch (e) {
        log('❌ List Error', e.message);
    }
}

runTest();
