#!/usr/bin/env node

/**
 * Universal PDF Test Script
 * 
 * Tests upload and extraction of ANY medical referral PDF
 * Validates extracted data against FE requirements
 * 
 * USAGE:
 *   node test-any-pdf.mjs <path-to-pdf>
 * 
 * EXAMPLE:
 *   node test-any-pdf.mjs "Medical Referral Document 3.pdf"
 *   node test-any-pdf.mjs "/path/to/new-referral.pdf"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// For Node 18+, FormData and Blob are built-in
const FormData = globalThis.FormData;
const Blob = globalThis.Blob;

// Configuration
const API_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';

// Required fields per FE API spec
const REQUIRED_FIELDS = [
    'patientName',      // Mapped from patientFirstName + patientLastName
    'dateOfBirth',      // Required field
    'referralReason',   // Mapped from 'reason' field  
    'insuranceProvider' // Mapped from 'payer' field
];

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
    console.log('\n' + '═'.repeat(70));
    log(`  ${title}`, 'bold');
    console.log('═'.repeat(70) + '\n');
}

function validateExtractedData(data) {
    const issues = [];
    const warnings = [];

    // Check for required fields
    REQUIRED_FIELDS.forEach(field => {
        if (!data[field] || data[field] === 'Unknown' || data[field] === null) {
            issues.push(`❌ Missing or invalid: ${field}`);
        } else {
            log(`  ✅ ${field}: ${data[field]}`, 'green');
        }
    });

    // Validate date format if present
    if (data.dateOfBirth) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.dateOfBirth)) {
            warnings.push(`⚠️  Date format issue: ${data.dateOfBirth} (expected YYYY-MM-DD)`);
        }
    }

    return { issues, warnings };
}

async function testPDF(pdfPath) {
    // Validate file exists
    if (!fs.existsSync(pdfPath)) {
        log(`❌ File not found: ${pdfPath}`, 'red');
        process.exit(1);
    }

    const fileName = path.basename(pdfPath);
    const fileSize = fs.statSync(pdfPath).size;
    const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);

    log(`📄 Testing PDF: ${fileName}`, 'blue');
    log(`   File size: ${fileSizeMB} MB`, 'blue');

    if (fileSize > 10 * 1024 * 1024) {
        log('⚠️  Warning: File exceeds 10MB limit', 'yellow');
    }

    let documentId = '';
    let extractedData = null;

    // ═══════════════════════════════════════════════════════════
    // STEP 1: Upload PDF
    // ═══════════════════════════════════════════════════════════
    section('STEP 1: Upload PDF');

    try {
        const fileBuffer = fs.readFileSync(pdfPath);
        const formData = new FormData();
        const blob = new Blob([fileBuffer], { type: 'application/pdf' });
        formData.append('file', blob, fileName);

        log('⏳ Uploading...', 'yellow');
        const startTime = Date.now();

        const uploadResponse = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        const uploadTime = Date.now() - startTime;
        const uploadResult = await uploadResponse.json();

        log(`⏱️  Upload time: ${uploadTime}ms`, 'blue');
        log(`📊 Response Status: ${uploadResponse.status}`, uploadResponse.ok ? 'green' : 'red');

        if (!uploadResponse.ok) {
            log('❌ Upload failed:', 'red');
            console.log(JSON.stringify(uploadResult, null, 2));
            process.exit(1);
        }

        documentId = uploadResult.id;

        log(`✅ Upload successful`, 'green');
        log(`   Document ID: ${documentId}`, 'blue');
        log(`   Uploaded at: ${uploadResult.uploadedAt}`, 'blue');

    } catch (error) {
        log(`❌ Upload error: ${error.message}`, 'red');
        process.exit(1);
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 2: Extract Patient Data
    // ═══════════════════════════════════════════════════════════
    section('STEP 2: Extract Patient Data (CEREBRAS AI)');

    // Small delay to ensure processing
    log('⏳ Waiting 2 seconds for processing...', 'yellow');
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        log('🤖 Calling CEREBRAS AI extraction...', 'yellow');
        const startTime = Date.now();

        const extractResponse = await fetch(`${API_URL}/extract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: documentId })
        });

        const extractTime = Date.now() - startTime;
        extractedData = await extractResponse.json();

        log(`⏱️  Extraction time: ${extractTime}ms`, 'blue');
        log(`📊 Response Status: ${extractResponse.status}`, extractResponse.ok ? 'green' : 'red');

        if (!extractResponse.ok) {
            log('❌ Extraction failed:', 'red');
            console.log(JSON.stringify(extractedData, null, 2));
            process.exit(1);
        }

        log(`✅ Extraction complete`, 'green');

    } catch (error) {
        log(`❌ Extraction error: ${error.message}`, 'red');
        process.exit(1);
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 3: Validate Extracted Data
    // ═══════════════════════════════════════════════════════════
    section('STEP 3: Validation Against FE Requirements');

    log('📋 Extracted Fields:', 'blue');
    const validation = validateExtractedData(extractedData);

    // Display warnings
    if (validation.warnings.length > 0) {
        console.log();
        log('⚠️  Warnings:', 'yellow');
        validation.warnings.forEach(w => log(`   ${w}`, 'yellow'));
    }

    // Display issues
    if (validation.issues.length > 0) {
        console.log();
        log('❌ Issues Found:', 'red');
        validation.issues.forEach(i => log(`   ${i}`, 'red'));
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 4: Full Response Display
    // ═══════════════════════════════════════════════════════════
    section('STEP 4: Complete Extracted Data (JSON)');

    console.log(JSON.stringify(extractedData, null, 2));

    // ═══════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════
    section('TEST SUMMARY');

    const totalIssues = validation.issues.length;
    const totalWarnings = validation.warnings.length;

    if (totalIssues === 0 && totalWarnings === 0) {
        log('🎉 All tests passed! Data ready for FE.', 'green');
    } else if (totalIssues === 0) {
        log(`⚠️  Passed with ${totalWarnings} warning(s)`, 'yellow');
    } else {
        log(`❌ Failed with ${totalIssues} issue(s) and ${totalWarnings} warning(s)`, 'red');
    }

    log(`\n📄 Tested file: ${fileName}`, 'blue');
    log(`🆔 Document ID: ${documentId}`, 'blue');
    log(`✨ You can use this ID to test /orchestrate and /confirm endpoints\n`, 'blue');
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
    log('❌ Usage: node test-any-pdf.mjs <path-to-pdf>', 'red');
    log('\nExample:', 'yellow');
    log('  node test-any-pdf.mjs "Medical Referral Document 3.pdf"', 'blue');
    log('  node test-any-pdf.mjs "/path/to/documents/referral.pdf"', 'blue');
    process.exit(1);
}

const pdfPath = path.resolve(args[0]);

testPDF(pdfPath).catch(error => {
    log(`\n💥 Unexpected error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});
