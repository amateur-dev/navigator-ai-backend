/**
 * Mock Referral Data Generator
 * 
 * Generates realistic referral objects with steps, actionLog, and messages
 * based on referral status and specialty.
 */

import { randomUUID } from 'crypto';

export type ReferralStatus = 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled';
export type MessageChannel = 'SMS' | 'Email' | 'WhatsApp' | 'Phone' | 'In-App';

interface Step {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
  completedAt?: string;
  description: string;
}

interface ActionLogEntry {
  id: string;
  event: string;
  type: 'system' | 'user' | 'eligibility' | 'pa' | 'scheduling' | 'message';
  timestamp: string;
  user: string;
  description: string;
  details?: Record<string, any>;
}

interface Message {
  id: string;
  channel: MessageChannel;
  content: string;
  timestamp: string;
  status: 'delivered' | 'read' | 'failed';
  direction: 'inbound' | 'outbound';
  recipient?: string;
}

interface MockReferral {
  id: string;
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
  age: number;
  specialty: string;
  payer: string;
  plan: string;
  status: ReferralStatus;
  urgency: 'routine' | 'urgent' | 'stat';
  appointmentDate: string;
  referralDate: string;
  noShowRisk: number;
  providerName: string;
  facilityName: string;
  reason: string;
  steps: Step[];
  actionLog: ActionLogEntry[];
  messages: Message[];
}

// ============================================================================
// CONFIGURATION & HELPERS
// ============================================================================

const STEP_LABELS = ['Intake', 'Eligibility', 'Prior Authorization', 'Scheduled', 'Completed'];

const FIRST_NAMES = ['Sarah', 'Michael', 'Jennifer', 'David', 'Emily', 'James', 'Patricia', 'Robert'];
const LAST_NAMES = ['Johnson', 'Chen', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];

const SPECIALTIES = [
  'Cardiology', 'Orthopedics', 'Dermatology', 'Neurology', 'Oncology',
  'Gastroenterology', 'Pulmonology', 'Urology', 'Ophthalmology', 'ENT'
];

const PAYERS = ['Blue Cross Blue Shield', 'UnitedHealthcare', 'Aetna', 'Cigna', 'Humana', 'Kaiser Permanente'];

const REASONS: Record<string, string[]> = {
  'Cardiology': ['Chest pain and irregular heartbeat', 'Hypertension management', 'Post-MI evaluation'],
  'Orthopedics': ['Chronic knee pain, potential meniscus tear', 'Lower back pain', 'Shoulder injury'],
  'Dermatology': ['Persistent rash evaluation', 'Skin biopsy needed', 'Acne management'],
  'Neurology': ['Recurring migraines', 'Numbness in extremities', 'Seizure evaluation'],
  'Oncology': ['Follow-up breast imaging abnormality', 'Cancer screening consultation', 'Treatment planning'],
};

const STAFF_NAMES = ['Dr. Emma Wilson', 'Linda Martinez', 'Sarah Chen', 'Mike Johnson', 'Dr. James Mitchell', 'Dr. Patricia Lee'];

const MESSAGE_TEMPLATES: Record<MessageChannel, string[]> = {
  'SMS': [
    'Hi {name}, your {specialty} appointment with {provider} is scheduled for {date} at {time} at {facility}. Please reply YES to confirm or CANCEL to reschedule.',
    'Reminder: Your appointment is in 3 days. Confirm by replying YES or call us to reschedule.',
    'Follow-up: Did you find the directions to {facility}? Reply with any questions.',
  ],
  'Email': [
    'Dear {name},\n\nThis is a reminder that you have an appointment scheduled:\n\nDate: {date}\nTime: {time}\nProvider: {provider}\nLocation: {facility}\n\nPlease bring your insurance card and valid ID.',
    'Your insurance eligibility has been verified. You\'re all set for your upcoming appointment.',
    'Your prior authorization has been approved. Reference #: {authNumber}',
  ],
  'WhatsApp': [
    'Hi {name} 👋 Your appointment is confirmed for {date}. See you soon!',
    'Any questions before your appointment? Feel free to reach out here.',
  ],
  'Phone': [
    'Automated confirmation call: Your appointment with {provider} is confirmed for {date} at {time}.',
  ],
  'In-App': [
    'Your appointment with {provider} is scheduled. Download the provider\'s map & directions.',
    'Pre-appointment questionnaire ready. Please complete before your visit.',
  ],
};

// ============================================================================
// CORE GENERATOR
// ============================================================================

/**
 * Determines how many steps should be "completed" based on status
 */
function getCompletionStageByStatus(status: ReferralStatus): number {
  switch (status) {
    case 'Pending': return 1; // Only Intake
    case 'Scheduled': return 3; // Intake, Eligibility, PA
    case 'Completed': return 5; // All steps
    case 'Cancelled': return 2; // Intake, Eligibility (then cancelled)
    default: return 1;
  }
}

/**
 * Generate a date that is between referralDate and appointmentDate
 */
function generateTimestampBetween(startDate: Date, endDate: Date): string {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const random = Math.random() * (end - start) + start;
  return new Date(random).toISOString();
}

/**
 * Add hours to a date
 */
function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

/**
 * Generate steps based on completion stage
 */
function generateSteps(completionStage: number, referralDate: Date, appointmentDate: Date): Step[] {
  const steps: Step[] = [];
  let currentTime = new Date(referralDate);

  for (let i = 0; i < STEP_LABELS.length; i++) {
    const label = STEP_LABELS[i];
    let status: 'completed' | 'current' | 'upcoming';
    let completedAt: string | undefined;

    if (i < completionStage) {
      status = 'completed';
      // Add 1-2 days per step for realistic progression
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

/**
 * Get description for a step
 */
function getStepDescription(label: string): string {
  const descriptions: Record<string, string> = {
    'Intake': 'Initial referral received and processed',
    'Eligibility': 'Insurance eligibility verified',
    'Prior Authorization': 'Prior authorization approved for specialist consultation',
    'Scheduled': 'Appointment scheduled with provider',
    'Completed': 'Appointment attended',
  };
  return descriptions[label] || '';
}

/**
 * Generate action log entries based on steps completed
 */
function generateActionLog(
  steps: Step[],
  referralDate: Date,
  appointmentDate: Date,
  patientName: string,
  providerName: string,
  specialty: string,
  plan: string,
  authNumber?: string
): ActionLogEntry[] {
  const logs: ActionLogEntry[] = [];
  let logId = 1;

  // 1. Referral Created (system)
  logs.push({
    id: `log-${logId++}`,
    event: 'Referral Created',
    type: 'system',
    timestamp: referralDate.toISOString(),
    user: STAFF_NAMES[Math.floor(Math.random() * STAFF_NAMES.length)],
    description: 'Referral created by primary care physician',
    details: { source: 'EHR Integration' },
  });

  // 2. Intake Completed (user)
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

  // 3. Eligibility Check Started (eligibility)
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

    // 4. Eligibility Verified (eligibility)
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

  // 5. PA Request & Approval (pa)
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

    // PA Approval
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

  // 6. Appointment Scheduled (scheduling)
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

/**
 * Generate messages based on action log and completed steps
 */
function generateMessages(
  actionLog: ActionLogEntry[],
  steps: Step[],
  patientName: string,
  providerName: string,
  specialty: string,
  appointmentDate: Date,
  patientEmail: string
): Message[] {
  const messages: Message[] = [];
  let msgId = 1;

  const schedulingLog = actionLog.find(a => a.event === 'Appointment Scheduled');
  if (schedulingLog) {
    // SMS confirmation
    messages.push({
      id: `msg-${msgId++}`,
      channel: 'SMS',
      content: `Hi ${patientName}, your ${specialty} appointment with ${providerName} is scheduled for ${appointmentDate.toLocaleDateString()} at ${appointmentDate.toLocaleTimeString()}. Please reply YES to confirm.`,
      timestamp: addHours(new Date(schedulingLog.timestamp), Math.random() * 2).toISOString(),
      status: 'delivered',
      direction: 'outbound',
      recipient: patientEmail,
    });

    // SMS response
    messages.push({
      id: `msg-${msgId++}`,
      channel: 'SMS',
      content: 'YES',
      timestamp: addHours(new Date(messages[messages.length - 1].timestamp), Math.random() * 72 + 12).toISOString(),
      status: 'delivered',
      direction: 'inbound',
      recipient: patientEmail,
    });

    // Email reminder (3 days before)
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

    // WhatsApp follow-up
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

  // If completed, add post-appointment in-app message
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

// ============================================================================
// PUBLIC FACTORY FUNCTION
// ============================================================================

/**
 * Generate a realistic mock referral with steps, actionLog, and messages
 * 
 * @param status - The referral status (Pending, Scheduled, Completed, Cancelled)
 * @param overrides - Optional field overrides
 * @returns A complete mock referral object
 */
export function generateMockReferral(
  status: ReferralStatus = 'Pending',
  overrides?: Partial<MockReferral>
): MockReferral {
  const id = overrides?.id || `ref-${randomUUID().substring(0, 8)}`;
  const firstName = overrides?.patientFirstName || FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = overrides?.patientLastName || LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const age = overrides?.age || Math.floor(Math.random() * 50) + 25;
  const specialty = overrides?.specialty || SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)];
  const payer = overrides?.payer || PAYERS[Math.floor(Math.random() * PAYERS.length)];
  const plan = overrides?.plan || `${payer} Standard Plan`;
  const urgency = overrides?.urgency || (Math.random() > 0.7 ? 'urgent' : Math.random() > 0.5 ? 'stat' : 'routine');
  const patientEmail = overrides?.patientEmail || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;
  const noShowRisk = overrides?.noShowRisk || Math.floor(Math.random() * 60) + 10;
  const providerName = overrides?.providerName || `Dr. ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
  const facilityName = overrides?.facilityName || `${specialty} Center`;
  const reason = overrides?.reason || (REASONS[specialty]?.[Math.floor(Math.random() * REASONS[specialty].length)] || 'General consultation');

  // Dates
  const referralDate = overrides?.referralDate
    ? new Date(overrides.referralDate)
    : new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Within last 30 days

  const appointmentDate = overrides?.appointmentDate
    ? new Date(overrides.appointmentDate)
    : new Date(referralDate.getTime() + (Math.random() * 30 + 5) * 24 * 60 * 60 * 1000); // 5-35 days from referral

  // Generate steps based on status
  const completionStage = getCompletionStageByStatus(status);
  const steps = generateSteps(completionStage, referralDate, appointmentDate);

  // Generate action log
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

  // Generate messages
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

/**
 * Generate multiple mock referrals with different statuses
 * 
 * @param count - Number of referrals to generate
 * @returns Array of mock referral objects
 */
export function generateMockReferrals(count: number = 5): MockReferral[] {
  const referrals: MockReferral[] = [];
  const statuses: ReferralStatus[] = ['Pending', 'Scheduled', 'Completed', 'Cancelled'];

  for (let i = 0; i < count; i++) {
    const status = statuses[i % statuses.length];
    referrals.push(generateMockReferral(status));
  }

  return referrals;
}

export type { MockReferral, Step, ActionLogEntry, Message };
