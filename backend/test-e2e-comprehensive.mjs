import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const VULTR_EXTRACT_URL = 'http://139.180.220.93:3001/extract';
const RAINDROP_BASE_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';

// Test Cases with Expected Values
const TEST_CASES = [
    {
        file: 'Medical Referral Document 4.pdf',
        expected: {
            patientName: 'David J. Kim',
            dateOfBirth: '1978-08-14',
            referralReason: 'Evaluation of changing nevus (mole) on upper back',
            insuranceProvider: 'Cigna Open Access Plus',
            expectedSpecialty: 'Dermatologist'
        }
    },
    {
        file: 'Medical Referral Document 5.pdf',
        expected: {
            patientName: "Sarah O'Connor",
            dateOfBirth: '1990-11-02',
            referralReason: 'Chronic refractory migraines with aura',
            insuranceProvider: 'Aetna Choice POS II',
            expectedSpecialty: 'Neurologist'
        }
    },
    {
        file: 'Medical Referral Document 6.pdf',
        expected: {
            patientName: 'Robert Barone',
            dateOfBirth: '1960-05-15',
            referralReason: 'Change in bowel habits, unintentional weight loss, anemia',
            insuranceProvider: 'Humana Medicare Advantage',
            expectedSpecialty: 'Gastroenterologist'
        }
    },
    {
        file: 'Medical Referral Document 7.pdf',
        expected: {
            patientName: 'Timothy Turner',
            dateOfBirth: '2018-02-10',
            referralReason: 'Poorly controlled asthma and suspected peanut allergy',
            insuranceProvider: 'Regence BlueShield',
            expectedSpecialty: 'Pediatrician'
        }
    },
    {
        file: 'Medical Referral Document 8.pdf',
        expected: {
            patientName: 'Martha Kent',
            dateOfBirth: '1965-06-01',
            referralReason: 'Abnormal Mammogram - BI-RADS 5',
            insuranceProvider: 'Kaiser Permanente',
            expectedSpecialty: 'Oncologist'
        }
    }
];

// Colors for console output
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m"
};

const log = (msg, color = 'reset') => console.log(`${colors[color]}${msg}${colors.reset}`);

// Assertion helpers
function assertEqual(actual, expected, field) {
    if (actual === expected) {
        log(`  ✅ ${field}: "${actual}"`, 'green');
        return true;
    } else {
        log(`  ❌ ${field}: Expected "${expected}", got "${actual}"`, 'red');
        return false;
    }
}

function assertContains(actual, expectedSubstring, field) {
    if (actual && actual.toLowerCase().includes(expectedSubstring.toLowerCase())) {
        log(`  ✅ ${field}: "${actual}" contains "${expectedSubstring}"`, 'green');
        return true;
    } else {
        log(`  ❌ ${field}: Expected to contain "${expectedSubstring}", got "${actual}"`, 'red');
        return false;
    }
}

async function runE2ETestForDocument(testCase, testNumber, totalTests) {
    const { file, expected } = testCase;
    const pdfPath = path.join(__dirname, file);

    log(`\n${'='.repeat(80)}`, 'cyan');
    log(`TEST ${testNumber}/${totalTests}: ${file}`, 'bright');
    log(`${'='.repeat(80)}`, 'cyan');

    if (!fs.existsSync(pdfPath)) {
        log(`❌ Error: PDF file not found at ${pdfPath}`, 'red');
        return { passed: false, file };
    }

    const results = {
        file,
        extraction: { passed: false, assertions: 0, failed: 0 },
        orchestration: { passed: false, assertions: 0, failed: 0 },
        confirmation: { passed: false, assertions: 0, failed: 0 },
        totalTime: 0
    };

    const startTime = Date.now();

    // STEP 1: Extraction (Vultr)
    let patientData;
    try {
        log('\n📄 STEP 1: Extracting Patient Data (Vultr)...', 'yellow');
        const stepStart = Date.now();

        const formData = new FormData();
        const fileBuffer = fs.readFileSync(pdfPath);
        const blob = new Blob([fileBuffer], { type: 'application/pdf' });
        formData.append('file', blob, file);

        const response = await fetch(VULTR_EXTRACT_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Extraction failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        patientData = result.data;

        const duration = ((Date.now() - stepStart) / 1000).toFixed(2);
        log(`✅ Extraction Complete (${duration}s)\n`, 'green');

        // Validate extraction
        log('🔍 Validating Extraction:', 'cyan');
        let passed = 0, failed = 0;

        if (assertEqual(patientData.patientName, expected.patientName, 'Patient Name')) passed++; else failed++;
        if (assertEqual(patientData.dateOfBirth, expected.dateOfBirth, 'Date of Birth')) passed++; else failed++;
        if (assertContains(patientData.referralReason, expected.referralReason.split(',')[0], 'Referral Reason (contains)')) passed++; else failed++;
        if (assertContains(patientData.insuranceProvider, expected.insuranceProvider.split(' ')[0], 'Insurance Provider (contains)')) passed++; else failed++;

        results.extraction.passed = (failed === 0);
        results.extraction.assertions = passed + failed;
        results.extraction.failed = failed;

    } catch (error) {
        log(`❌ Step 1 Failed: ${error.message}`, 'red');
        return results;
    }

    // STEP 2: Orchestration (Raindrop)
    let doctorMatch;
    try {
        log('\n🏥 STEP 2: Finding Specialist (Raindrop)...', 'yellow');
        const stepStart = Date.now();

        const response = await fetch(`${RAINDROP_BASE_URL}/orchestrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientName: patientData.patientName,
                referralReason: patientData.referralReason,
                insuranceProvider: patientData.insuranceProvider
            })
        });

        if (!response.ok) {
            throw new Error(`Orchestration failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        doctorMatch = result.data;

        const duration = ((Date.now() - stepStart) / 1000).toFixed(2);
        log(`✅ Doctor Matched (${duration}s)\n`, 'green');

        // Validate orchestration
        log('🔍 Validating Orchestration:', 'cyan');
        let passed = 0, failed = 0;

        if (assertEqual(doctorMatch.specialist, expected.expectedSpecialty, 'Specialty Match')) passed++; else failed++;

        if (doctorMatch.assignedDoctor) {
            log(`  ✅ Doctor Assigned: ${doctorMatch.assignedDoctor}`, 'green');
            passed++;
        } else {
            log(`  ❌ No doctor assigned`, 'red');
            failed++;
        }

        results.orchestration.passed = (failed === 0);
        results.orchestration.assertions = passed + failed;
        results.orchestration.failed = failed;

    } catch (error) {
        log(`❌ Step 2 Failed: ${error.message}`, 'red');
        return results;
    }

    // STEP 3: Confirmation (Raindrop)
    try {
        log('\n✉️  STEP 3: Generating Confirmation (Raindrop)...', 'yellow');
        const stepStart = Date.now();

        // Pick the first available slot or use a future date
        let appointmentDate;
        if (doctorMatch.availableSlots && doctorMatch.availableSlots.length > 0) {
            appointmentDate = doctorMatch.availableSlots[0];
        } else {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            appointmentDate = tomorrow.toISOString();
        }

        const dateObj = new Date(appointmentDate);

        const confirmPayload = {
            referralId: doctorMatch.referralId,
            patientName: patientData.patientName,
            patientEmail: `${patientData.patientName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            patientPhone: "+1-555-0100",
            doctorName: doctorMatch.assignedDoctor,
            specialty: doctorMatch.specialist,
            appointmentDate: dateObj.toISOString().split('T')[0],
            appointmentTime: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        const response = await fetch(`${RAINDROP_BASE_URL}/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(confirmPayload)
        });

        if (!response.ok) {
            throw new Error(`Confirmation failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        const duration = ((Date.now() - stepStart) / 1000).toFixed(2);
        log(`✅ Confirmation Generated (${duration}s)\n`, 'green');

        // Validate confirmation
        log('🔍 Validating Confirmation:', 'cyan');
        let passed = 0, failed = 0;

        if (result.success) {
            log(`  ✅ Confirmation Successful`, 'green');
            passed++;
        } else {
            log(`  ❌ Confirmation Failed`, 'red');
            failed++;
        }

        if (result.notifications && result.notifications.sms) {
            log(`  ✅ SMS preview generated (${result.notifications.sms.length} chars)`, 'green');
            passed++;
        } else {
            log(`  ❌ No SMS preview`, 'red');
            failed++;
        }

        if (result.notifications && result.notifications.email) {
            log(`  ✅ Email preview generated`, 'green');
            passed++;
        } else {
            log(`  ❌ No Email preview`, 'red');
            failed++;
        }

        results.confirmation.passed = (failed === 0);
        results.confirmation.assertions = passed + failed;
        results.confirmation.failed = failed;

    } catch (error) {
        log(`❌ Step 3 Failed: ${error.message}`, 'red');
        return results;
    }

    results.totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    return results;
}

async function runAllTests() {
    log('\n╔════════════════════════════════════════════════════════════════╗', 'bright');
    log('║        NAVIGATOR-AI END-TO-END VERIFICATION TEST SUITE        ║', 'bright');
    log('╚════════════════════════════════════════════════════════════════╝\n', 'bright');

    log(`📋 Test Configuration:`, 'cyan');
    log(`   Extraction Service: ${VULTR_EXTRACT_URL}`, 'cyan');
    log(`   Raindrop Backend: ${RAINDROP_BASE_URL}`, 'cyan');
    log(`   Total Test Cases: ${TEST_CASES.length}\n`, 'cyan');

    const allResults = [];

    for (let i = 0; i < TEST_CASES.length; i++) {
        const result = await runE2ETestForDocument(TEST_CASES[i], i + 1, TEST_CASES.length);
        allResults.push(result);
    }

    // Summary Report
    log(`\n${'='.repeat(80)}`, 'cyan');
    log('📊 TEST SUMMARY REPORT', 'bright');
    log(`${'='.repeat(80)}\n`, 'cyan');

    let totalPassed = 0;
    let totalFailed = 0;
    let totalAssertions = 0;

    allResults.forEach((result, idx) => {
        const testPassed = result.extraction.passed && result.orchestration.passed && result.confirmation.passed;
        totalPassed += testPassed ? 1 : 0;
        totalFailed += testPassed ? 0 : 1;

        const assertions = result.extraction.assertions + result.orchestration.assertions + result.confirmation.assertions;
        const failed = result.extraction.failed + result.orchestration.failed + result.confirmation.failed;
        totalAssertions += assertions;

        const icon = testPassed ? '✅' : '❌';
        const color = testPassed ? 'green' : 'red';

        log(`${icon} Test ${idx + 1}: ${result.file}`, color);
        log(`   Assertions: ${assertions - failed}/${assertions} passed`, color);
        if (result.totalTime) {
            log(`   Time: ${result.totalTime}s`, 'cyan');
        }
    });

    log(`\n${'─'.repeat(80)}`, 'cyan');
    log(`📈 OVERALL RESULTS:`, 'bright');
    log(`   Tests Passed: ${totalPassed}/${TEST_CASES.length}`, totalFailed === 0 ? 'green' : 'yellow');
    log(`   Total Assertions: ${totalAssertions}`, 'cyan');

    if (totalFailed === 0) {
        log(`\n🎉 ALL TESTS PASSED! System is fully verified.`, 'green');
    } else {
        log(`\n⚠️  ${totalFailed} test(s) failed. Please review above.`, 'yellow');
    }

    log(`${'='.repeat(80)}\n`, 'cyan');

    process.exit(totalFailed === 0 ? 0 : 1);
}

runAllTests();
