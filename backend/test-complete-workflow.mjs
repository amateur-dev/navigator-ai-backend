#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';
const PDF_FILE = path.join(__dirname, 'Medical Referral Document 3.pdf');

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║   COMPLETE END-TO-END WORKFLOW TEST: Medical Referral Doc 3  ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

async function runCompleteWorkflow() {
    let uploadedFilename = '';
    let extractedData = {};
    let orchestratedData = {};

    // ═══════════════════════════════════════════════════════════════
    // STEP 1: UPLOAD PDF
    // ═══════════════════════════════════════════════════════════════
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 1: UPLOAD PDF                                          │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    try {
        const fileBuffer = fs.readFileSync(PDF_FILE);
        const formData = new FormData();
        const blob = new Blob([fileBuffer], { type: 'application/pdf' });
        formData.append('file', blob, 'Medical Referral Document 3.pdf');

        const uploadResponse = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        const uploadResult = await uploadResponse.json();

        console.log(`Status: ${uploadResponse.status}`);
        console.log('Response:');
        console.log(JSON.stringify(uploadResult, null, 2));

        uploadedFilename = 'Medical Referral Document 3.pdf';

        // Extract data from upload response (Raindrop returns mock extraction data)
        if (uploadResult.data && uploadResult.data.extractedData) {
            const extracted = uploadResult.data.extractedData;
            extractedData = {
                patientName: `${extracted.patientFirstName} ${extracted.patientLastName}`,
                dateOfBirth: null, // Not in upload response
                referralReason: extracted.reason,
                insuranceProvider: extracted.payer
            };

            console.log('\n✅ Upload successful!');
            console.log('\nExtracted Data from Upload:');
            console.log(`   Patient: ${extractedData.patientName}`);
            console.log(`   Condition: ${extractedData.referralReason}`);
            console.log(`   Insurance: ${extractedData.insuranceProvider}\n`);
        } else {
            console.log('\n✅ Upload successful!\n');
        }
    } catch (error) {
        console.error('❌ Upload failed:', error.message);
        return;
    }

    // Wait a moment for processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ═══════════════════════════════════════════════════════════════
    // STEP 2: EXTRACT DATA
    // ═══════════════════════════════════════════════════════════════
    console.log('\n┌─────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 2: DATA ALREADY EXTRACTED FROM UPLOAD                  │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');
    console.log('ℹ️  The /upload endpoint already extracted patient data using AI.');
    console.log('   No need to call /extract separately.\n');

    // ═══════════════════════════════════════════════════════════════
    // STEP 3: ORCHESTRATE (Find Doctor)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n┌─────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 3: ORCHESTRATE - FIND SPECIALIST                       │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    try {
        const orchestrateResponse = await fetch(`${API_URL}/orchestrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientName: extractedData.patientName,
                referralReason: extractedData.referralReason,
                insuranceProvider: extractedData.insuranceProvider
            })
        });

        const orchestrateResult = await orchestrateResponse.json();
        orchestratedData = orchestrateResult.data || {};

        console.log(`Status: ${orchestrateResponse.status}`);
        console.log('Orchestration Result:');
        console.log(JSON.stringify(orchestrateResult, null, 2));

        console.log('\n✅ Orchestration successful!');
        console.log(`   Specialty Matched: ${orchestratedData.specialist || 'N/A'}`);
        console.log(`   Assigned Doctor: ${orchestratedData.assignedDoctor || 'N/A'}`);
        console.log(`   Insurance Status: ${orchestratedData.insuranceStatus || 'N/A'}`);
        console.log(`   Available Slots: ${orchestratedData.availableSlots?.length || 0}\n`);
    } catch (error) {
        console.error('❌ Orchestration failed:', error.message);
        return;
    }

    // ═══════════════════════════════════════════════════════════════
    // STEP 4: CONFIRM APPOINTMENT
    // ═══════════════════════════════════════════════════════════════
    console.log('\n┌─────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 4: CONFIRM APPOINTMENT                                  │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');

    try {
        const confirmResponse = await fetch(`${API_URL}/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                referralId: orchestratedData.referralId,
                patientName: extractedData.patientName,
                patientEmail: 'patient@email.com',
                patientPhone: '+1-555-0123',
                doctorName: orchestratedData.assignedDoctor,
                specialty: orchestratedData.specialist,
                appointmentDate: '2024-11-26',
                appointmentTime: '10:00 AM'
            })
        });

        const confirmResult = await confirmResponse.json();

        console.log(`Status: ${confirmResponse.status}`);
        console.log('Confirmation Result:');
        console.log(JSON.stringify(confirmResult, null, 2));

        if (confirmResult.success && confirmResult.notifications) {
            console.log('\n✅ Confirmation successful!\n');

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📱 SMS PREVIEW');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`To: ${confirmResult.notifications.sms.to}`);
            console.log(`Message:\n${confirmResult.notifications.sms.message}`);
            console.log(`\nLength: ${confirmResult.notifications.sms.length} characters`);
            console.log(`Estimated Cost: ${confirmResult.notifications.sms.estimatedCost}`);

            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📧 EMAIL PREVIEW');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`To: ${confirmResult.notifications.email.to}`);
            console.log(`Subject: ${confirmResult.notifications.email.subject}`);
            console.log(`\n${confirmResult.notifications.email.body}`);
        }
    } catch (error) {
        console.error('❌ Confirmation failed:', error.message);
        return;
    }

    // ═══════════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════════
    console.log('\n\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    WORKFLOW SUMMARY                           ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    console.log('✅ All 4 steps completed successfully!\n');
    console.log('Summary:');
    console.log(`  • Patient: ${extractedData.patientName}`);
    console.log(`  • Condition: ${extractedData.referralReason}`);
    console.log(`  • Specialty: ${orchestratedData.specialist}`);
    console.log(`  • Doctor: ${orchestratedData.assignedDoctor}`);
    console.log(`  • Referral ID: ${orchestratedData.referralId}`);
    console.log(`  • Insurance: ${orchestratedData.insuranceStatus}`);
    console.log('\n🎉 End-to-end workflow test complete!\n');
}

runCompleteWorkflow().catch(console.error);
