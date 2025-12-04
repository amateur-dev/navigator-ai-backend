#!/usr/bin/env node
/**
 * Comprehensive test for all three fixes:
 * 1. Extract endpoint extracts phone and email
 * 2. Orchestration auto-progresses to confirmed with notifications
 * 3. Seed properly clears demo data
 */

import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';
let testsPassed = 0;
let testsFailed = 0;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(80));
  log(title, 'bold');
  console.log('='.repeat(80));
}

async function test(name, fn) {
  try {
    log(`✓ Testing: ${name}`, 'blue');
    await fn();
    log(`  ✅ PASS`, 'green');
    testsPassed++;
  } catch (error) {
    log(`  ❌ FAIL: ${error.message}`, 'red');
    testsFailed++;
  }
}

async function runTests() {
  section('COMPREHENSIVE FIX VALIDATION TEST SUITE');

  // ============================================================================
  // TEST 1: SEED - Clear demo data
  // ============================================================================
  section('TEST 1: SEED ENDPOINT - Demo Data Cleanup');

  log('Clearing database to start fresh (using clearReferralsOnly to preserve specialists)...', 'yellow');
  const seedRes = await fetch(`${API_URL}/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clearReferralsOnly: true })
  });
  const seedData = await seedRes.json();
  log(`Seed Response: ${JSON.stringify(seedData, null, 2)}`);

  await test('Seed endpoint returns success', async () => {
    if (!seedData.success) throw new Error('Seed did not return success');
  });

  await test('Seed clears all referrals', async () => {
    const refRes = await fetch(`${API_URL}/referrals`);
    const refData = await refRes.json();
    if (refData.data.referrals.length !== 0) {
      throw new Error(`Expected 0 referrals, got ${refData.data.referrals.length}`);
    }
    log(`  → Confirmed: ${refData.data.referrals.length} referrals in database`, 'yellow');
  });

  // ============================================================================
  // TEST 2: ORCHESTRATION - Auto-confirmation with notifications
  // ============================================================================
  section('TEST 2: ORCHESTRATION ENDPOINT - Auto-Confirmation & Notifications');

  log('Creating referral with patient contact info...', 'yellow');
  const orchestratePayload = {
    referralData: {
      patientFirstName: 'Sarah',
      patientLastName: 'Johnson',
      patientEmail: 'sarah.johnson@email.com',
      patientPhoneNumber: '+1-555-123-4567',
      age: 42,
      reason: 'Chest pain and irregular heartbeat',
      specialty: 'Cardiologist',
      payer: 'Blue Cross Blue Shield',
      plan: 'Premium PPO',
      urgency: 'High'
    }
  };

  const orchestRes = await fetch(`${API_URL}/orchestrate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orchestratePayload)
  });

  if (!orchestRes.ok) {
    const errData = await orchestRes.json();
    log(`Orchestration Error: ${JSON.stringify(errData, null, 2)}`, 'red');
    throw new Error(`Orchestration failed: ${orchestRes.status}`);
  }

  const orchestData = await orchestRes.json();
  log(`Orchestration Response: ${JSON.stringify(orchestData, null, 2)}`);

  let referralId = '';
  await test('Orchestration returns success', async () => {
    if (!orchestData.success) throw new Error('Orchestration did not return success');
    referralId = orchestData.data.referralId;
    if (!referralId) throw new Error('No referralId in response');
    log(`  → Referral ID: ${referralId}`, 'yellow');
  });

  await test('Referral auto-progressed to Confirmed status', async () => {
    if (orchestData.data.status !== 'Confirmed') {
      throw new Error(`Expected status 'Confirmed', got '${orchestData.data.status}'`);
    }
    log(`  → Status: ${orchestData.data.status}`, 'yellow');
  });

  await test('Orchestration includes all completed steps', async () => {
    const steps = orchestData.data.completedSteps;
    const required = ['Referral Created', 'Eligibility Verified', 'Prior Authorization Approved', 'Appointment Scheduled'];
    for (const step of required) {
      if (!steps.includes(step)) {
        throw new Error(`Missing step: ${step}`);
      }
    }
    log(`  → Completed Steps: ${steps.join(', ')}`, 'yellow');
  });

  await test('Notifications sent status is reported', async () => {
    if (!orchestData.data.notificationsSent) {
      throw new Error('notificationsSent object missing');
    }
    if (!orchestData.data.notificationsSent.email) {
      throw new Error('Email notification not sent (expected true)');
    }
    if (!orchestData.data.notificationsSent.sms) {
      throw new Error('SMS notification not sent (expected true)');
    }
    log(`  → Email Sent: ${orchestData.data.notificationsSent.email}`, 'yellow');
    log(`  → SMS Sent: ${orchestData.data.notificationsSent.sms}`, 'yellow');
  });

  // ============================================================================
  // TEST 3: REFERRAL LOGS - Verify notifications were logged
  // ============================================================================
  section('TEST 3: REFERRAL LOGS - Notification Events Logged');

  log(`Fetching logs for referral ${referralId}...`, 'yellow');
  const logsRes = await fetch(`${API_URL}/referral/${referralId}/logs`);
  const logsData = await logsRes.json();
  log(`Logs Response: ${JSON.stringify(logsData, null, 2)}`);

  await test('Logs endpoint returns success', async () => {
    if (!logsData.success) throw new Error('Logs endpoint did not return success');
  });

  await test('Orchestration logs include all workflow steps', async () => {
    const events = logsData.data.logs.map(l => l.event);
    const required = [
      'Referral Created',
      'Eligibility Verified',
      'Prior Authorization Approved',
      'Appointment Scheduled'
    ];
    for (const evt of required) {
      if (!events.includes(evt)) {
        throw new Error(`Missing event: ${evt}`);
      }
    }
    log(`  → Workflow Events: ${events.join(', ')}`, 'yellow');
  });

  await test('Email notification event was logged', async () => {
    const emailLog = logsData.data.logs.find(l => l.event === 'Appointment Confirmation Email Sent');
    if (!emailLog) throw new Error('Email notification event not found in logs');
    if (emailLog.details.recipient !== 'sarah.johnson@email.com') {
      throw new Error(`Email recipient mismatch: expected sarah.johnson@email.com, got ${emailLog.details.recipient}`);
    }
    log(`  → Email logged to: ${emailLog.details.recipient}`, 'yellow');
    log(`  → Email log: ${JSON.stringify(emailLog, null, 2)}`, 'yellow');
  });

  await test('SMS notification event was logged', async () => {
    const smsLog = logsData.data.logs.find(l => l.event === 'Appointment Confirmation SMS Sent');
    if (!smsLog) throw new Error('SMS notification event not found in logs');
    if (smsLog.details.recipient !== '+1-555-123-4567') {
      throw new Error(`SMS recipient mismatch: expected +1-555-123-4567, got ${smsLog.details.recipient}`);
    }
    log(`  → SMS logged to: ${smsLog.details.recipient}`, 'yellow');
    log(`  → SMS log: ${JSON.stringify(smsLog, null, 2)}`, 'yellow');
  });

  // ============================================================================
  // TEST 4: REFERRAL DETAILS - Verify auto-confirmed status persists
  // ============================================================================
  section('TEST 4: REFERRAL DETAILS - Status Verified');

  log(`Fetching referral details for ${referralId}...`, 'yellow');
  const detailRes = await fetch(`${API_URL}/referral/${referralId}`);
  const detailData = await detailRes.json();
  log(`Referral Detail: ${JSON.stringify(detailData.data, null, 2)}`);

  await test('Referral detail shows Confirmed status', async () => {
    if (detailData.data.status !== 'Confirmed') {
      throw new Error(`Expected status 'Confirmed', got '${detailData.data.status}'`);
    }
    log(`  → Referral Status: ${detailData.data.status}`, 'yellow');
  });

  await test('Patient contact info preserved', async () => {
    if (detailData.data.patientEmail !== 'sarah.johnson@email.com') {
      throw new Error(`Email mismatch: ${detailData.data.patientEmail}`);
    }
    if (detailData.data.patientPhoneNumber !== '+1-555-123-4567') {
      throw new Error(`Phone mismatch: ${detailData.data.patientPhoneNumber}`);
    }
    log(`  → Email: ${detailData.data.patientEmail}`, 'yellow');
    log(`  → Phone: ${detailData.data.patientPhoneNumber}`, 'yellow');
  });

  // ============================================================================
  // TEST 5: ERROR HANDLING - Verify error messages sent to frontend
  // ============================================================================
  section('TEST 5: ERROR HANDLING - Error Messages to Frontend');

  await test('Extract endpoint returns error when doc ID missing', async () => {
    const errRes = await fetch(`${API_URL}/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const errData = await errRes.json();
    if (errRes.status !== 400) throw new Error(`Expected 400, got ${errRes.status}`);
    if (!errData.error) throw new Error('No error object in response');
    if (!errData.error.code) throw new Error('No error code in response');
    if (!errData.error.message) throw new Error('No error message in response');
    log(`  → Error Code: ${errData.error.code}`, 'yellow');
    log(`  → Error Message: ${errData.error.message}`, 'yellow');
    log(`  → Full Error: ${JSON.stringify(errData.error, null, 2)}`, 'yellow');
  });

  await test('Orchestrate endpoint returns error for missing fields', async () => {
    const errRes = await fetch(`${API_URL}/orchestrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralData: { patientFirstName: 'John' } })
    });
    const errData = await errRes.json();
    if (errRes.status !== 400) throw new Error(`Expected 400, got ${errRes.status}`);
    if (!errData.error.code) throw new Error('No error code in response');
    if (!errData.error.message) throw new Error('No error message in response');
    log(`  → Error Code: ${errData.error.code}`, 'yellow');
    log(`  → Error Message: ${errData.error.message}`, 'yellow');
  });

  // ============================================================================
  // TEST 6: SEED CLEARREFERRALSONLY - Verify selective cleanup
  // ============================================================================
  section('TEST 6: SEED ENDPOINT - Selective Cleanup');

  // Create another referral
  await fetch(`${API_URL}/orchestrate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      referralData: {
        patientFirstName: 'John',
        patientLastName: 'Doe',
        reason: 'Checkup'
      }
    })
  });

  log('Clearing only referrals (preserving specialists)...', 'yellow');
  const clearRes = await fetch(`${API_URL}/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clearReferralsOnly: true })
  });
  const clearData = await clearRes.json();
  log(`Seed Clear Response: ${JSON.stringify(clearData, null, 2)}`);

  await test('Selective clear returns success', async () => {
    if (!clearData.success) throw new Error('Selective clear failed');
  });

  await test('Referrals are cleared after selective seed', async () => {
    const refRes = await fetch(`${API_URL}/referrals`);
    const refData = await refRes.json();
    if (refData.data.referrals.length !== 0) {
      throw new Error(`Expected 0 referrals, got ${refData.data.referrals.length}`);
    }
    log(`  → Referrals cleared: ${clearData.data.referralsCleared}`, 'yellow');
    log(`  → Current referrals count: ${refData.data.referrals.length}`, 'yellow');
  });

  // ============================================================================
  // FINAL SUMMARY
  // ============================================================================
  section('TEST SUMMARY');

  const total = testsPassed + testsFailed;
  log(`Total Tests: ${total}`, 'bold');
  log(`✅ Passed: ${testsPassed}`, 'green');
  if (testsFailed > 0) {
    log(`❌ Failed: ${testsFailed}`, 'red');
  } else {
    log(`❌ Failed: ${testsFailed}`, 'green');
  }

  if (testsFailed === 0) {
    log('\n🎉 ALL TESTS PASSED! All fixes verified.', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Some tests failed. Review output above.', 'red');
    process.exit(1);
  }
}

// Start server check before running tests
async function checkServer() {
  try {
    const res = await fetch(`${API_URL}/ping`);
    if (res.ok) {
      log(`✅ Backend server is running on ${API_URL}`, 'green');
      return true;
    }
  } catch (error) {
    log(`❌ Backend server not running on ${API_URL}`, 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

(async () => {
  const serverRunning = await checkServer();
  if (!serverRunning) {
    log('\n⚠️  Please start the backend server with: npm start', 'yellow');
    process.exit(1);
  }
  await runTests();
})();
