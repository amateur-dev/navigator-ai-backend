# Demo Referrals Summary (15 Profiles for Hackathon)

Generated: December 3, 2025

## Overview
15 complete referral profiles distributed across the patient journey workflow, each with realistic steps, action logs, and multi-channel messaging communications.

## Distribution

### By Referral Stage:
- **Just Now Referred** (Intake only): 3 referrals
  - Only Intake step completed
  - Eligibility pending
  - Ready to demonstrate workflow start
  
- **Intake Stage** (Intake → Eligibility): 3 referrals
  - Intake completed
  - Eligibility check in progress
  - Shows mid-workflow state
  
- **Eligibility Check** (Eligibility verification): 3 referrals
  - Eligibility verification happening
  - Prior Authorization pending
  - Shows system processing
  
- **Scheduled**: 3 referrals
  - All steps through scheduling completed
  - Appointment confirmed
  - Shows successful booking
  
- **Completed**: 3 referrals
  - All 5 workflow steps completed
  - Patient attended appointment
  - Shows full journey resolution

### By Messaging Channel:
- **SMS**: 3 referrals (text-based confirmations and reminders)
- **Email**: 3 referrals (formal appointment details and reminders)
- **WhatsApp**: 3 referrals (friendly messaging with emojis)
- **Phone**: 3 referrals (automated confirmation calls)
- **In-App**: 3 referrals (in-platform notifications and feedback)

## Data Structure

Each referral includes:

### Profile Fields:
- Patient name, age, email
- Specialty and provider
- Insurance plan and copay/coinsurance
- Urgency level (routine, urgent, stat)
- No-show risk percentage

### Workflow Steps:
1. Intake (initial processing)
2. Eligibility (insurance verification)
3. Prior Authorization (PA approval)
4. Scheduled (appointment booked)
5. Completed (visit attended)

Each step shows:
- Status: completed | current | upcoming
- Timestamp when completed
- Description

### Action Log (Audit Trail):
Events with types: system, user, eligibility, pa, scheduling, message

Example progression:
1. Referral Created (system)
2. Intake Completed (user)
3. Eligibility Check Started (eligibility)
4. Eligibility Verified (eligibility)
5. PA Request Submitted (pa)
6. PA Approved (pa)
7. Appointment Scheduled (scheduling)

### Messages (Communication History):
- Channel: SMS, Email, WhatsApp, Phone, In-App
- Direction: outbound (system-to-patient) or inbound (patient-to-system)
- Status: delivered, read, failed
- Timestamps align with action log events

**Pending referrals**: Have minimal messages (or none if before scheduling)
**Scheduled referrals**: Have confirmation + reminder messages
**Completed referrals**: Have full history + post-visit feedback request

## File Location
`backend/temp/demo-referrals-15.json`

## Use Cases for Demo

1. **Dashboard View**: Show 15 referrals with different statuses in a card view
2. **Stage Visualization**: Demonstrate workflow progression with cards moving through stages
3. **Message Timeline**: Show incoming/outgoing communications for each referral
4. **Action Audit Trail**: Display complete history of actions taken
5. **Search & Filter**: Filter by status, specialty, channel, urgency
6. **Individual Details**: Click through to see full referral with all steps, logs, and messages

## Sample Referral IDs for Quick Reference:
- Pending (Just Now): ref-demo-01, ref-demo-02, ref-demo-03
- Eligibility: ref-demo-04, ref-demo-05, ref-demo-06
- More Eligibility: ref-demo-07, ref-demo-08, ref-demo-09
- Scheduled: ref-demo-10, ref-demo-11, ref-demo-12
- Completed: ref-demo-13, ref-demo-14, ref-demo-15

