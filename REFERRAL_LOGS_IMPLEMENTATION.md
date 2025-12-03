# Referral Logs Implementation

## Overview
This document describes the implementation of the referral logging system that tracks all activities and events related to patient referrals in the Navigator AI backend.

## Changes Made

### 1. Database Schema (`backend/src/api/index.ts`)

#### Added `referral_logs` Table
A new table was created to store all referral-related events with the following structure:

```sql
CREATE TABLE IF NOT EXISTS referral_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referral_id INTEGER NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
    event TEXT NOT NULL,
    type TEXT NOT NULL,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    user TEXT DEFAULT 'system',
    description TEXT,
    details TEXT
);
```

**Columns:**
- `id`: Unique log entry identifier
- `referral_id`: Foreign key reference to the referral
- `event`: Event name (e.g., "Referral Created", "Eligibility Verified")
- `type`: Event category - one of: `system`, `user`, `eligibility`, `pa`, `scheduling`, `message`
- `timestamp`: ISO timestamp of when the event occurred
- `user`: User who triggered the event (defaults to "system")
- `description`: Human-readable description of what happened
- `details`: JSON string containing additional metadata

### 2. Logging Utility Function

A new async function `logReferralEvent()` was added to `backend/src/api/index.ts`:

```typescript
async function logReferralEvent(
  db: any,
  referralId: number | string,
  event: string,
  type: 'system' | 'user' | 'eligibility' | 'pa' | 'scheduling' | 'message',
  description: string,
  user: string = 'system',
  details: Record<string, any> | null = null
): Promise<void>
```

**Features:**
- Safely sanitizes SQL input to prevent injection
- Handles JSON serialization of details
- Silently logs failures without throwing exceptions
- Uses `datetime('now')` for consistent timestamp handling

### 3. Updated `/referral/:id/logs` Endpoint

The `GET /referral/:id/logs` endpoint was completely reimplemented to:

1. **Validate referral existence** - Returns 404 if referral not found
2. **Fetch logs from database** - Queries all logs for the referral
3. **Parse and format results** - Returns logs in the expected API format
4. **Handle JSON details** - Parses details column back into objects
5. **Return pagination info** - Includes pagination metadata

**Response Format:**
```json
{
  "success": true,
  "data": {
    "referralId": "ref-123",
    "logs": [
      {
        "id": "log-1",
        "event": "Referral Created",
        "type": "system",
        "timestamp": "2024-01-15T10:30:00Z",
        "user": "system",
        "description": "Referral created through orchestration engine",
        "details": { ... }
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "pageSize": 5
    }
  }
}
```

### 4. Orchestration Endpoint Updates

The `POST /orchestrate` endpoint now logs referral creation events:

- **Event**: "Referral Created"
- **Type**: `system`
- **Details**: Includes patientName, referralReason, specialty, and insuranceProvider

### 5. Seed Endpoint Enhancements

The `POST /seed` endpoint was updated to create demo referrals with realistic event logs:

- All 15 demo referrals now have initial creation logs
- Pending referrals get: Referral Created event
- Scheduled referrals get: Referral Created + Eligibility Verified + PA Request Submitted + PA Approved + Appointment Scheduled
- Completed referrals get: All above + Appointment Completed

This creates realistic audit trails for testing and demonstration purposes.

## Event Types

The logging system supports the following event types:

| Type | Usage |
|------|-------|
| `system` | System-generated events (referral creation, status changes) |
| `user` | User actions (manual updates, approvals) |
| `eligibility` | Insurance eligibility checks and verification |
| `pa` | Prior authorization requests and approvals |
| `scheduling` | Appointment scheduling and rescheduling |
| `message` | Patient communications (SMS, email, calls) |

## Event Examples

### Referral Created
```json
{
  "event": "Referral Created",
  "type": "system",
  "description": "Referral created through orchestration engine",
  "details": {
    "patientName": "John Doe",
    "referralReason": "Chest pain",
    "specialty": "Cardiology",
    "insuranceProvider": "Blue Cross Blue Shield"
  }
}
```

### Eligibility Verified
```json
{
  "event": "Eligibility Verified",
  "type": "eligibility",
  "description": "Insurance coverage confirmed",
  "user": "system"
}
```

### PA Approved
```json
{
  "event": "PA Approved",
  "type": "pa",
  "description": "Prior authorization approved by payer",
  "user": "system"
}
```

## Frontend Integration

The frontend `ReferralLogs` component in `frontend/app/(app)/app/referrals/referral-logs.tsx` automatically uses these logs via the `getReferralLogs` action:

```typescript
const { data: logsData, isPending } = useQuery({
  queryKey: ['referral-logs', referralId],
  queryFn: async () => {
    const data = await getReferralLogs(referralId)
    return data
  }
})
```

The logs are then filtered by type and displayed with appropriate icons and formatting.

## Database Migration

When seeding the database:

1. The `referral_logs` table is created
2. Existing logs are cleared (if upgrading)
3. Demo referrals are inserted with complete event histories
4. This provides realistic data for testing the logs UI

## Error Handling

- If logging fails, errors are logged to console but don't interrupt the referral creation flow
- Missing logs table will cause the `/logs` endpoint to return an error
- Invalid referral IDs return a 404 response
- Database errors return a 500 response with descriptive error messages

## Testing

To test the implementation:

1. **Seed the database**: `POST /seed`
2. **Create a new referral**: `POST /orchestrate` with patient details
3. **Fetch logs**: `GET /referral/ref-{id}/logs`
4. **Verify in UI**: Navigate to referral details to see activity logs

## Future Enhancements

- Add pagination to large log result sets
- Implement log filtering by date range
- Add user action logs for admin activities
- Create log archiving for old entries
- Add log search/query capabilities
- Implement real-time log updates via WebSocket
