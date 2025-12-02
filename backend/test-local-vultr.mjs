
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VULTR_URL = 'http://localhost:3002/extract';
const FILE_PATH = path.join(__dirname, 'Medical Referral Document 9.pdf');

async function testLocalVultr() {
    console.log(`Testing Local Vultr Service at ${VULTR_URL}`);
    
    if (!fs.existsSync(FILE_PATH)) {
        console.error(`File not found: ${FILE_PATH}`);
        return;
    }

    const fileBuffer = fs.readFileSync(FILE_PATH);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', blob, 'referral.pdf');

    try {
        const response = await fetch(VULTR_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Status ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Extraction Result:', JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testLocalVultr();
