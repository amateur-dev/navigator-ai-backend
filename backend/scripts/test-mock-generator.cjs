#!/usr/bin/env node

/**
 * Test script for mock referral generator
 * Run directly with: node scripts/test-mock-generator.js
 */

const { randomUUID } = require('crypto');

// ============================================================================
// CONFIGURATION & HELPERS (copied from generator)
// ============================================================================

const STEP_LABELS = ['Intake', 'Eligibility', 'Prior Authorization', 'Scheduled', 'Completed'];

const FIRST_NAMES = ['Sarah', 'Michael', 'Jennifer', 'David', 'Emily', 'James', 'Patricia', 'Robert'];
const LAST_NAMES = ['Johnson', 'Chen', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];

const SPECIALTIES = [
  'Cardiology', 'Orthopedics', 'Dermatology', 'Neurology', 'Oncology',
  'Gastroenterology', 'Pulmonology', 'Urology', 'Ophthalmology', 'ENT'
];

const PAYERS = ['Blue Cross Blue Shield', 'UnitedHealthcare', 'Aetna', 'Cigna', 'Humana', 'Kaiser Permanente'];

const REASONS = {
  'Cardiology': ['Chest pain and irregular heartbeat', 'Hypertension management', 'Post-MI evaluation'],
  'Orthopedics': ['Chronic knee pain, potential meniscus tear', 'Lower back pain', 'Shoulder injury'],
  'Dermatology': ['Persistent rash evaluation', 'Skin biopsy needed', 'Acne management'],
  'Neurology': ['Recurring migraines', 'Numbness in extremities', 'Seizure evaluation'],
  'Oncology': ['Follow-up breast imaging abnormality', 'Cancer screening consultation', 'Treatment planning'],
};

const STAFF_NAMES = ['Dr. Emma Wilson', 'Linda Martinez', 'Sarah Chen', 'Mike Johnson', 'Dr. James Mitchell', 'Dr. Patricia Lee'];

function getCompletionStageByStatus(status) {
  switch (status) {
    case 'Pending': return 1;
    case 'Scheduled': return 3;
    case 'Completed': return 5;
    case 'Cancelled': return 2;
    default: return 1;
  }
}

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function getStepDescription(label) {
  const descriptions = {
    'Intake': 'Initial referral received and processed',
    'Eligibility': 'Insurance eligibility verified',
    'Prior Authorization': 'Prior authorization approved for specialist consultation',
    'Scheduled': 'Appointment scheduled with provider',
    'Completed': 'Appointment attended',
  };
  return descriptions[label] || '';
}

function generateSteps(completionStage, referralDate, appointmentDate) {
  const steps = [];
  let currentTime = new Date(referralDate);

  for (let i = 0; i < STEP_LABELS.length; i++) {
    const label = STEP_LABELS[i];
    let status;
    let completedAt;

    if (i < completionStage) {
      status = 'completed';
      currentTime = addHours(currentTime, Math.random() * 24 + 12);
      completedAt = currentTime.toISOString();
    } else if (i === completionStage) {
      status = 'current';
    } else {
      status = 'upcoming';
    }

    steps.push({
      id: `step-${i + 1}`,
      label,
      status,
      completedAt,
      description: getStepDescription(label),
    });
  }

  return steps;
}

function generateActionLog(steps, referralDate, appointmentDate, patientName, providerName, specialty, plan, authNumber) {
  const logs = [];
  let logId = 1;

  logs.push({
    id: `log-${logId++}`,
    event: 'Referral Created',
    type: 'system',
    timestamp: referralDate.toISOString(),
    user: STAFF_NAMES[Math.floor(Math.random() * STAFF_NAMES.length)],
    description: 'Referral created by primary care physician',
    details: { source: 'EHR Integration' },
  });

  const intakeStep = steps.find(s => s.label === 'Intake');
  if (intakeStep?.status !== 'upcoming') {
    logs.push({
      id: `log-${logId++}`,
      event: 'Intake Completed',
      type: 'user',
      timestamp: intakeStep?.completedAt || referralDate.toISOString(),
      user: STAFF_NAMES[Math.floor(Math.random() * STAFF_NAMES.length)],
      description: 'Patient demographics and insurance information verified',
    });
  }

  const eligibilityStep = steps.find(s => s.label === 'Eligibility');
  if (eligibilityStep?.status !== 'upcoming') {
    const eligCheckStarted = addHours(
      new Date(intakeStep?.completedAt || referralDate.toISOString()),
      Math.random() * 12 + 6
    );
    logs.push({
      id: `log-${logId++}`,
      event: 'Eligibility Check Started',
      type: 'eligibility',
      timestamp: eligCheckStarted.toISOString(),
      user: 'System',
      description: 'Automated eligibility verification initiated',
    });

    logs.push({
      id: `log-${logId++}`,
      event: 'Eligibility Verified',
      type: 'eligibility',
      timestamp: eligibilityStep?.completedAt || addHours(eligCheckStarted, 1).toISOString(),
      user: 'System',
      description: 'Insurance active, benefits confirmed',
      details: {
        copay: `$${Math.floor(Math.random() * 60) + 20}`,
        coinsurance: `${Math.floor(Math.random() * 30) + 10}%`,
      },
    });
  }

  const paStep = steps.find(s => s.label === 'Prior Authorization');
  if (paStep?.status !== 'upcoming') {
    const paRequestTime = addHours(new Date(eligibilityStep?.completedAt || referralDate.toISOString()), Math.random() * 24 + 12);
    logs.push({
      id: `log-${logId++}`,
      event: 'PA Request Submitted',
      type: 'pa',
      timestamp: paRequestTime.toISOString(),
      user: STAFF_NAMES[Math.floor(Math.random() * STAFF_NAMES.length)],
      description: 'Prior authorization request submitted to payer',
    });

    logs.push({
      id: `log-${logId++}`,
      event: 'PA Approved',
      type: 'pa',
      timestamp: paStep?.completedAt || addHours(paRequestTime, Math.random() * 48 + 24).toISOString(),
      user: plan,
      description: `Prior authorization approved - Authorization #${authNumber || `PA-${Date.now()}`}`,
      details: {
        authNumber: authNumber || `PA-${Date.now()}`,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
  }

  const scheduledStep = steps.find(s => s.label === 'Scheduled');
  if (scheduledStep?.status !== 'upcoming') {
    logs.push({
      id: `log-${logId++}`,
      event: 'Appointment Scheduled',
      type: 'scheduling',
      timestamp: scheduledStep?.completedAt || addHours(new Date(paStep?.completedAt || referralDate.toISOString()), Math.random() * 24).toISOString(),
      user: STAFF_NAMES[Math.floor(Math.random() * STAFF_NAMES.length)],
      description: `Appointment scheduled for ${appointmentDate.toDateString()}`,
    });
  }

  return logs;
}

function generateMessages(actionLog, steps, patientName, providerName, specialty, appointmentDate, patientEmail) {
  const messages = [];
  let msgId = 1;

  const schedulingLog = actionLog.find(a => a.event === 'Appointment Scheduled');
  if (schedulingLog) {
    messages.push({
      id: `msg-${msgId++}`,
      channel: 'SMS',
      content: `Hi ${patientName}, your ${specialty} appointment with ${providerName} is scheduled for ${appointmentDate.toLocaleDateString()} at ${appointmentDate.toLocaleTimeString()}. Please reply YES to confirm.`,
      timestamp: addHours(new Date(schedulingLog.timestamp), Math.random() * 2).toISOString(),
      status: 'delivered',
      direction: 'outbound',
      recipient: patientEmail,
    });

    messages.push({
      id: `msg-${msgId++}`,
      channel: 'SMS',
      content: 'YES',
      timestamp: addHours(new Date(messages[messages.length - 1].timestamp), Math.random() * 72 + 12).toISOString(),
      status: 'delivered',
      direction: 'inbound',
      recipient: patientEmail,
    });

    const reminderTime = new Date(appointmentDate.getTime() - 3 * 24 * 60 * 60 * 1000);
    messages.push({
      id: `msg-${msgId++}`,
      channel: 'Email',
      content: `Dear ${patientName},\n\nThis is a reminder that you have an appointment scheduled:\n\nDate: ${appointmentDate.toDateString()}\nProvider: ${providerName}\nSpecialty: ${specialty}\n\nPlease bring your insurance card and a valid ID.`,
      timestamp: reminderTime.toISOString(),
      status: 'delivered',
      direction: 'outbound',
      recipient: patientEmail,
    });

    messages.push({
      id: `msg-${msgId++}`,
      channel: 'WhatsApp',
      content: `Hi ${patientName} 👋 Just checking in - any questions before your appointment with ${providerName}?`,
      timestamp: addHours(new Date(messages[messages.length - 1].timestamp), Math.random() * 24 + 12).toISOString(),
      status: 'delivered',
      direction: 'outbound',
      recipient: patientEmail,
    });
  }

  const completedStep = steps.find(s => s.label === 'Completed');
  if (completedStep?.status === 'completed') {
    messages.push({
      id: `msg-${msgId++}`,
      channel: 'In-App',
      content: 'Thank you for attending your appointment! Please take a moment to rate your experience.',
      timestamp: addHours(new Date(appointmentDate), Math.random() * 24).toISOString(),
      status: 'delivered',
      direction: 'outbound',
      recipient: patientEmail,
    });
  }

  return messages;
}

function generateMockReferral(status = 'Pending', overrides = {}) {
  const id = overrides.id || `ref-${randomUUID().substring(0, 8)}`;
  const firstName = overrides.patientFirstName || FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = overrides.patientLastName || LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const age = overrides.age || Math.floor(Math.random() * 50) + 25;
  const specialty = overrides.specialty || SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)];
  const payer = overrides.payer || PAYERS[Math.floor(Math.random() * PAYERS.length)];
  const plan = overrides.plan || `${payer} Standard Plan`;
  const urgency = overrides.urgency || (Math.random() > 0.7 ? 'urgent' : Math.random() > 0.5 ? 'stat' : 'routine');
  const patientEmail = overrides.patientEmail || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;
  const noShowRisk = overrides.noShowRisk || Math.floor(Math.random() * 60) + 10;
  const providerName = overrides.providerName || `Dr. ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
  const facilityName = overrides.facilityName || `${specialty} Center`;
  const reason = overrides.reason || (REASONS[specialty]?.[Math.floor(Math.random() * REASONS[specialty].length)] || 'General consultation');

  const referralDate = overrides.referralDate
    ? new Date(overrides.referralDate)
    : new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

  const appointmentDate = overrides.appointmentDate
    ? new Date(overrides.appointmentDate)
    : new Date(referralDate.getTime() + (Math.random() * 30 + 5) * 24 * 60 * 60 * 1000);

  const completionStage = getCompletionStageByStatus(status);
  const steps = generateSteps(completionStage, referralDate, appointmentDate);

  const authNumber = `PA-${Date.now()}`;
  const actionLog = generateActionLog(
    steps,
    referralDate,
    appointmentDate,
    `${firstName} ${lastName}`,
    providerName,
    specialty,
    payer,
    authNumber
  );

  const messages = generateMessages(
    actionLog,
    steps,
    `${firstName} ${lastName}`,
    providerName,
    specialty,
    appointmentDate,
    patientEmail
  );

  return {
    id,
    patientFirstName: firstName,
    patientLastName: lastName,
    patientEmail,
    age,
    specialty,
    payer,
    plan,
    status,
    urgency,
    appointmentDate: appointmentDate.toISOString(),
    referralDate: referralDate.toISOString(),
    noShowRisk,
    providerName,
    facilityName,
    reason,
    steps,
    actionLog,
    messages,
  };
}

// ============================================================================
// TEST: Generate samples for each status
// ============================================================================

console.log('\n========== PENDING REFERRAL ==========\n');
const pending = generateMockReferral('Pending');
console.log(JSON.stringify(pending, null, 2));

console.log('\n\n========== SCHEDULED REFERRAL ==========\n');
const scheduled = generateMockReferral('Scheduled');
console.log(JSON.stringify(scheduled, null, 2));

console.log('\n\n========== COMPLETED REFERRAL ==========\n');
const completed = generateMockReferral('Completed');
console.log(JSON.stringify(completed, null, 2));
