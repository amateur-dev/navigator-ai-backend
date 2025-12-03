/**
 * Seed script to generate 15 mock referrals for hackathon demo
 * Distributes referrals across different stages and messaging channels
 * Run with: node scripts/seed-demo-referrals.cjs
 */

const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION & HELPERS (from mock-referral-generator)
// ============================================================================

const STEP_LABELS = ['Intake', 'Eligibility', 'Prior Authorization', 'Scheduled', 'Completed'];

const FIRST_NAMES = ['Sarah', 'Michael', 'Jennifer', 'David', 'Emily', 'James', 'Patricia', 'Robert', 'Linda', 'Richard', 'Mary', 'Charles', 'Karen', 'Thomas', 'Nancy'];
const LAST_NAMES = ['Johnson', 'Chen', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Lee', 'Patel', 'Taylor', 'Anderson', 'Thomas'];

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
  'Gastroenterology': ['Chronic stomach pain', 'GERD management', 'Inflammatory bowel disease'],
  'Pulmonology': ['Persistent cough', 'Sleep apnea evaluation', 'Asthma management'],
  'Urology': ['Urinary tract issues', 'Prostate evaluation', 'Kidney stone follow-up'],
  'Ophthalmology': ['Vision correction consultation', 'Cataracts evaluation', 'Diabetic retinopathy'],
  'ENT': ['Chronic sinusitis', 'Hearing loss evaluation', 'Throat inflammation'],
};

const STAFF_NAMES = ['Dr. Emma Wilson', 'Linda Martinez', 'Sarah Chen', 'Mike Johnson', 'Dr. James Mitchell', 'Dr. Patricia Lee'];

// ============================================================================
// STAGE DISTRIBUTION (15 referrals across 5 stages: 3 each)
// ============================================================================

// For "Pending" we'll use the following sub-stages to vary within it:
// 1. Just now referred (only Intake step completed)
// 2. At intake stage (Intake completed, starting Eligibility)
// 3. At eligibility check (Eligibility started but not verified)

const STAGE_DISTRIBUTION = {
  'JustNowReferred': 3,    // Intake completed only
  'IntakeStage': 3,        // Intake completed, Eligibility current
  'EligibilityCheckStage': 3, // Eligibility checking
  'Scheduled': 3,          // All through PA, Scheduled current
  'Completed': 3,          // All steps completed
};

// ============================================================================
// MESSAGE CHANNEL DISTRIBUTION
// ============================================================================

const MESSAGE_CHANNELS = ['SMS', 'Email', 'WhatsApp', 'Phone', 'In-App'];

function getCompletionStageByStatus(stage) {
  switch (stage) {
    case 'JustNowReferred': return 1;     // Only Intake
    case 'IntakeStage': return 1;          // Intake completed, Eligibility starting
    case 'EligibilityCheckStage': return 2; // Eligibility in progress
    case 'Scheduled': return 4;            // Through scheduling
    case 'Completed': return 5;            // All complete
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

function generateMessages(actionLog, steps, patientName, providerName, specialty, appointmentDate, patientEmail, primaryChannel) {
  const messages = [];
  let msgId = 1;

  const schedulingLog = actionLog.find(a => a.event === 'Appointment Scheduled');
  if (schedulingLog) {
    // Primary channel confirmation
    messages.push({
      id: `msg-${msgId++}`,
      channel: primaryChannel,
      content: generateMessageContent(primaryChannel, patientName, specialty, providerName, appointmentDate, 'confirmation'),
      timestamp: addHours(new Date(schedulingLog.timestamp), Math.random() * 2).toISOString(),
      status: 'delivered',
      direction: 'outbound',
      recipient: patientEmail,
    });

    // Inbound response (if SMS, Email, or WhatsApp)
    if (['SMS', 'Email', 'WhatsApp'].includes(primaryChannel)) {
      messages.push({
        id: `msg-${msgId++}`,
        channel: primaryChannel,
        content: primaryChannel === 'Email' ? 'Confirmed' : 'YES',
        timestamp: addHours(new Date(messages[messages.length - 1].timestamp), Math.random() * 72 + 12).toISOString(),
        status: 'delivered',
        direction: 'inbound',
        recipient: patientEmail,
      });
    }

    // 3-day reminder in secondary channel
    const reminderTime = new Date(appointmentDate.getTime() - 3 * 24 * 60 * 60 * 1000);
    const secondaryChannel = MESSAGE_CHANNELS.find(c => c !== primaryChannel);
    messages.push({
      id: `msg-${msgId++}`,
      channel: secondaryChannel,
      content: generateMessageContent(secondaryChannel, patientName, specialty, providerName, appointmentDate, 'reminder'),
      timestamp: reminderTime.toISOString(),
      status: 'delivered',
      direction: 'outbound',
      recipient: patientEmail,
    });
  }

  // Post-appointment message if completed
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

function generateMessageContent(channel, patientName, specialty, providerName, appointmentDate, type) {
  if (type === 'confirmation') {
    switch (channel) {
      case 'SMS':
        return `Hi ${patientName}, your ${specialty} appointment with ${providerName} is scheduled for ${appointmentDate.toLocaleDateString()} at ${appointmentDate.toLocaleTimeString()}. Please reply YES to confirm.`;
      case 'Email':
        return `Dear ${patientName},\n\nThis is to confirm your appointment:\n\nDate: ${appointmentDate.toDateString()}\nTime: ${appointmentDate.toLocaleTimeString()}\nProvider: ${providerName}\nSpecialty: ${specialty}\n\nPlease bring your insurance card and valid ID.`;
      case 'WhatsApp':
        return `Hi ${patientName} 👋 Your ${specialty} appointment with ${providerName} on ${appointmentDate.toLocaleDateString()} at ${appointmentDate.toLocaleTimeString()} is confirmed. See you soon!`;
      case 'Phone':
        return `[Automated call] Confirming your ${specialty} appointment with ${providerName} on ${appointmentDate.toLocaleDateString()}. Press 1 to confirm or 2 to reschedule.`;
      case 'In-App':
        return `Your appointment with ${providerName} is scheduled for ${appointmentDate.toLocaleDateString()}. View details and directions in the app.`;
    }
  } else if (type === 'reminder') {
    switch (channel) {
      case 'SMS':
        return `Reminder: Your appointment with ${providerName} is in 3 days on ${appointmentDate.toLocaleDateString()}. Reply CONFIRM to confirm or call us to reschedule.`;
      case 'Email':
        return `Dear ${patientName},\n\nReminder: You have an appointment coming up in 3 days:\n\nDate: ${appointmentDate.toDateString()}\nTime: ${appointmentDate.toLocaleTimeString()}\nProvider: ${providerName}\n\nNeed to reschedule? Reply to this email.`;
      case 'WhatsApp':
        return `Hey ${patientName}! Just a reminder - your appointment with ${providerName} is in 3 days. Any questions? Just ask! 📅`;
      case 'Phone':
        return `[Automated reminder] Your appointment with ${providerName} is in 3 days on ${appointmentDate.toLocaleDateString()}.`;
      case 'In-App':
        return `Reminder: Your appointment with ${providerName} is in 3 days on ${appointmentDate.toLocaleDateString()}.`;
    }
  }
  return '';
}

function generateMockReferral(stage, index, overrides = {}) {
  const id = `ref-demo-${String(index + 1).padStart(2, '0')}`;
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const lastName = LAST_NAMES[index % LAST_NAMES.length];
  const age = Math.floor(Math.random() * 50) + 25;
  const specialty = SPECIALTIES[index % SPECIALTIES.length];
  const payer = PAYERS[Math.floor(Math.random() * PAYERS.length)];
  const plan = `${payer} Standard Plan`;
  const urgency = ['routine', 'urgent', 'stat'][Math.floor(Math.random() * 3)];
  const patientEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;
  const noShowRisk = Math.floor(Math.random() * 60) + 10;
  const providerName = `Dr. ${LAST_NAMES[(index + 1) % LAST_NAMES.length]}`;
  const facilityName = `${specialty} Center`;
  const reason = REASONS[specialty]?.[Math.floor(Math.random() * REASONS[specialty].length)] || 'General consultation';
  
  // Pick primary message channel based on referral index for diversity
  const primaryChannel = MESSAGE_CHANNELS[index % MESSAGE_CHANNELS.length];

  const referralDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
  const appointmentDate = new Date(referralDate.getTime() + (Math.random() * 30 + 5) * 24 * 60 * 60 * 1000);

  const completionStage = getCompletionStageByStatus(stage);
  const steps = generateSteps(completionStage, referralDate, appointmentDate);

  const authNumber = `PA-${Date.now()}-${index}`;
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
    patientEmail,
    primaryChannel
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
    status: stage === 'JustNowReferred' || stage === 'IntakeStage' || stage === 'EligibilityCheckStage' ? 'Pending' : stage,
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
    primaryChannel, // Metadata for demo
  };
}

// ============================================================================
// MAIN: Generate 15 referrals for demo
// ============================================================================

function generateDemoReferrals() {
  const referrals = [];
  let index = 0;

  // JustNowReferred (3 referrals)
  for (let i = 0; i < STAGE_DISTRIBUTION.JustNowReferred; i++) {
    referrals.push(generateMockReferral('JustNowReferred', index++));
  }

  // IntakeStage (3 referrals)
  for (let i = 0; i < STAGE_DISTRIBUTION.IntakeStage; i++) {
    referrals.push(generateMockReferral('IntakeStage', index++));
  }

  // EligibilityCheckStage (3 referrals)
  for (let i = 0; i < STAGE_DISTRIBUTION.EligibilityCheckStage; i++) {
    referrals.push(generateMockReferral('EligibilityCheckStage', index++));
  }

  // Scheduled (3 referrals)
  for (let i = 0; i < STAGE_DISTRIBUTION.Scheduled; i++) {
    referrals.push(generateMockReferral('Scheduled', index++));
  }

  // Completed (3 referrals)
  for (let i = 0; i < STAGE_DISTRIBUTION.Completed; i++) {
    referrals.push(generateMockReferral('Completed', index++));
  }

  return referrals;
}

// ============================================================================
// OUTPUT
// ============================================================================

const demoReferrals = generateDemoReferrals();

// Output summary
console.log('\n========== DEMO REFERRALS GENERATED (15 TOTAL) ==========\n');
console.log('Distribution:');
console.log(`  • Just Now Referred (Intake completed): ${STAGE_DISTRIBUTION.JustNowReferred}`);
console.log(`  • Intake Stage (Intake→Eligibility): ${STAGE_DISTRIBUTION.IntakeStage}`);
console.log(`  • Eligibility Check Stage: ${STAGE_DISTRIBUTION.EligibilityCheckStage}`);
console.log(`  • Scheduled: ${STAGE_DISTRIBUTION.Scheduled}`);
console.log(`  • Completed: ${STAGE_DISTRIBUTION.Completed}`);

console.log('\nMessaging Channels Distribution:');
MESSAGE_CHANNELS.forEach((channel, i) => {
  const count = demoReferrals.filter(r => r.primaryChannel === channel).length;
  console.log(`  • ${channel}: ${count} referrals`);
});

console.log('\nSample Referrals by Stage:\n');

// Show one example from each stage
const stages = ['JustNowReferred', 'IntakeStage', 'EligibilityCheckStage', 'Scheduled', 'Completed'];
stages.forEach(stage => {
  const example = demoReferrals.find(r => {
    if (stage === 'JustNowReferred') return r.steps[0].status === 'completed' && r.steps[1].status === 'upcoming';
    if (stage === 'IntakeStage') return r.steps[0].status === 'completed' && r.steps[1].status === 'current';
    if (stage === 'EligibilityCheckStage') return r.steps[1].status === 'current';
    return r.status === stage;
  });
  
  if (example) {
    console.log(`\n${stage}:`);
    console.log(`  ID: ${example.id}`);
    console.log(`  Patient: ${example.patientFirstName} ${example.patientLastName}`);
    console.log(`  Specialty: ${example.specialty}`);
    console.log(`  Current Step: ${example.steps.find(s => s.status === 'current')?.label || 'All complete'}`);
    console.log(`  Primary Channel: ${example.primaryChannel}`);
    console.log(`  Messages: ${example.messages.length}`);
    console.log(`  Action Logs: ${example.actionLog.length}`);
  }
});

// Save to JSON file
const outputPath = path.join(__dirname, '../temp/demo-referrals-15.json');
const outputDir = path.dirname(outputPath);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(demoReferrals, null, 2));
console.log(`\n✅ Full data saved to: ${outputPath}\n`);

// Export for use in other scripts
module.exports = { generateDemoReferrals, generateMockReferral };
