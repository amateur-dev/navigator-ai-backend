# Backend API Endpoints Documentation

This document outlines all the backend endpoints required for the Better Start application to function properly.

## Table of Contents
- [1. POST /upload](#1-post-upload)
- [2. POST /orchestrate](#2-post-orchestrate)
- [3. GET /referrals](#3-get-referrals)
- [4. GET /referral/:id](#4-get-referralid)
- [5. GET /referral/:id/logs](#5-get-referralidlogs)

---

## 1. POST /upload

**Description:** Accepts a PDF file (referral document) and returns the parsed information as a JSON object back to the client for confirmation. This endpoint uses OCR/AI to extract structured data from the referral form.

**Endpoint:** `POST /upload`

**Content-Type:** `multipart/form-data`

### Request

**Form Data:**
- `file` (required): PDF file containing the referral form
- `maxSize`: 10MB

**Example Request:**
```bash
curl -X POST http://localhost:3000/upload \
  -F "file=@referral-form.pdf"
```

### Response

**Status Code:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "data": {
    "extractedData": {
      "patientFirstName": "Sarah",
      "patientLastName": "Johnson",
      "patientEmail": "sarah.johnson@email.com",
      "age": 58,
      "specialty": "Cardiology",
      "payer": "Blue Cross Blue Shield",
      "plan": "Blue Cross PPO Plus",
      "urgency": "urgent",
      "appointmentDate": null,
      "referralDate": "2025-11-10T14:00:00Z",
      "providerName": "Dr. James Mitchell",
      "facilityName": "Downtown Medical Center",
      "reason": "Chest pain and irregular heartbeat"
    },
    "confidence": 0.95,
    "documentId": "doc-12345678",
    "needsReview": false,
    "warnings": []
  },
  "message": "Document processed successfully"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the upload was successful |
| `data.extractedData` | object | Extracted patient and referral information |
| `data.extractedData.patientFirstName` | string | Patient's first name |
| `data.extractedData.patientLastName` | string | Patient's last name |
| `data.extractedData.patientEmail` | string | Patient's email address |
| `data.extractedData.age` | number | Patient's age |
| `data.extractedData.specialty` | string | Medical specialty for referral |
| `data.extractedData.payer` | string | Insurance payer name |
| `data.extractedData.plan` | string | Insurance plan name |
| `data.extractedData.urgency` | string | Urgency level: `routine`, `urgent`, or `stat` |
| `data.extractedData.appointmentDate` | string \| null | Appointment date if specified (ISO 8601) |
| `data.extractedData.referralDate` | string | Date referral was created (ISO 8601) |
| `data.extractedData.providerName` | string | Referring provider's name |
| `data.extractedData.facilityName` | string | Facility/practice name |
| `data.extractedData.reason` | string | Reason for referral |
| `data.confidence` | number | AI confidence score (0-1) |
| `data.documentId` | string | Unique identifier for the uploaded document |
| `data.needsReview` | boolean | Whether manual review is recommended |
| `data.warnings` | string[] | Any warnings or potential issues detected |
| `message` | string | Success message |

### Error Response

**Status Code:** `400 Bad Request` | `413 Payload Too Large` | `415 Unsupported Media Type` | `500 Internal Server Error`

```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Only PDF files are accepted",
    "statusCode": 415
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `NO_FILE_PROVIDED` | 400 | No file was included in the request |
| `INVALID_FILE_TYPE` | 415 | File is not a PDF |
| `FILE_TOO_LARGE` | 413 | File exceeds 10MB limit |
| `OCR_FAILED` | 500 | Failed to process the document |
| `EXTRACTION_FAILED` | 500 | Failed to extract structured data |
| `LOW_CONFIDENCE` | 422 | Extraction confidence too low, manual review required |

---

## 2. POST /orchestrate

**Description:** Accepts the JSON object from the `/upload` endpoint (potentially with user corrections) and orchestrates the agentic process to handle the referral workflow. This includes eligibility verification, prior authorization, scheduling, and patient communication.

**Endpoint:** `POST /orchestrate`

**Content-Type:** `application/json`

### Request

**Request Body:**
```json
{
  "documentId": "doc-12345678",
  "referralData": {
    "patientFirstName": "Sarah",
    "patientLastName": "Johnson",
    "patientEmail": "sarah.johnson@email.com",
    "age": 58,
    "specialty": "Cardiology",
    "payer": "Blue Cross Blue Shield",
    "plan": "Blue Cross PPO Plus",
    "urgency": "urgent",
    "appointmentDate": null,
    "referralDate": "2025-11-10T14:00:00Z",
    "providerName": "Dr. James Mitchell",
    "facilityName": "Downtown Medical Center",
    "reason": "Chest pain and irregular heartbeat"
  },
  "autoSchedule": true,
  "sendNotifications": true
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `documentId` | string | Yes | ID of the uploaded document from `/upload` |
| `referralData` | object | Yes | Referral information (from upload or user-corrected) |
| `autoSchedule` | boolean | No | Whether to automatically schedule appointment (default: true) |
| `sendNotifications` | boolean | No | Whether to send patient notifications (default: true) |

### Response

**Status Code:** `200 OK` | `202 Accepted` (for async processing)

**Response Body:**
```json
{
  "success": true,
  "data": {
    "referralId": "ref-001",
    "status": "Scheduled",
    "orchestrationId": "orch-98765432",
    "completedSteps": [
      {
        "id": "step-1",
        "label": "Intake",
        "status": "completed",
        "completedAt": "2025-11-10T14:15:00Z"
      },
      {
        "id": "step-2",
        "label": "Eligibility",
        "status": "completed",
        "completedAt": "2025-11-11T09:30:00Z"
      },
      {
        "id": "step-3",
        "label": "Prior Authorization",
        "status": "completed",
        "completedAt": "2025-11-13T16:45:00Z"
      },
      {
        "id": "step-4",
        "label": "Scheduled",
        "status": "completed",
        "completedAt": "2025-11-15T11:20:00Z"
      }
    ],
    "appointmentDetails": {
      "appointmentDate": "2025-11-22T10:30:00Z",
      "providerName": "Dr. James Mitchell",
      "facilityName": "Downtown Medical Center",
      "facilityAddress": "123 Main St, New York, NY 10001"
    },
    "notificationsSent": {
      "sms": true,
      "email": true
    },
    "estimatedCompletionTime": "2025-11-15T11:30:00Z"
  },
  "message": "Referral orchestration completed successfully"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether orchestration was successful |
| `data.referralId` | string | Unique identifier for the created referral |
| `data.status` | string | Current referral status: `Pending`, `Scheduled`, `Completed`, `Cancelled` |
| `data.orchestrationId` | string | Unique identifier for this orchestration process |
| `data.completedSteps` | array | Array of workflow steps completed |
| `data.completedSteps[].id` | string | Step identifier |
| `data.completedSteps[].label` | string | Step display name |
| `data.completedSteps[].status` | string | Step status: `completed`, `current`, `upcoming` |
| `data.completedSteps[].completedAt` | string | Timestamp when step was completed (ISO 8601) |
| `data.appointmentDetails` | object | Appointment information (if scheduled) |
| `data.appointmentDetails.appointmentDate` | string | Scheduled appointment date/time (ISO 8601) |
| `data.appointmentDetails.providerName` | string | Provider's name |
| `data.appointmentDetails.facilityName` | string | Facility name |
| `data.appointmentDetails.facilityAddress` | string | Facility address |
| `data.notificationsSent` | object | Notification delivery status |
| `data.notificationsSent.sms` | boolean | Whether SMS was sent |
| `data.notificationsSent.email` | boolean | Whether email was sent |
| `data.estimatedCompletionTime` | string | When orchestration completed (ISO 8601) |
| `message` | string | Success message |

### Error Response

**Status Code:** `400 Bad Request` | `404 Not Found` | `500 Internal Server Error`

```json
{
  "success": false,
  "error": {
    "code": "ORCHESTRATION_FAILED",
    "message": "Failed to complete eligibility verification",
    "details": {
      "step": "eligibility",
      "reason": "Unable to verify insurance eligibility with payer"
    },
    "statusCode": 500
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_DOCUMENT_ID` | 404 | Document ID not found |
| `MISSING_REQUIRED_FIELDS` | 400 | Required referral data fields are missing |
| `ELIGIBILITY_FAILED` | 500 | Insurance eligibility check failed |
| `PA_REQUIRED` | 202 | Prior authorization required, processing asynchronously |
| `SCHEDULING_FAILED` | 500 | Failed to schedule appointment |
| `NOTIFICATION_FAILED` | 207 | Orchestration succeeded but notifications failed |
| `ORCHESTRATION_FAILED` | 500 | General orchestration failure |

---

## 3. GET /referrals

**Description:** Returns the list of all referrals with basic information. Supports filtering, sorting, and pagination.

**Endpoint:** `GET /referrals`

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Results per page (default: 50, max: 100) |
| `status` | string | No | Filter by status: `Pending`, `Scheduled`, `Completed`, `Cancelled` (comma-separated for multiple) |
| `specialty` | string | No | Filter by specialty (comma-separated for multiple) |
| `payer` | string | No | Filter by payer (comma-separated for multiple) |
| `search` | string | No | Search by patient name or email |
| `sortBy` | string | No | Sort field: `patientFirstName`, `appointmentDate`, `referralDate`, `status` (default: `referralDate`) |
| `sortOrder` | string | No | Sort order: `asc` or `desc` (default: `desc`) |
| `dateFrom` | string | No | Filter referrals from this date (ISO 8601) |
| `dateTo` | string | No | Filter referrals until this date (ISO 8601) |

### Request Example

```bash
# Get all referrals
GET /referrals

# Get pending referrals for Cardiology
GET /referrals?status=Pending&specialty=Cardiology

# Search and sort
GET /referrals?search=Johnson&sortBy=appointmentDate&sortOrder=asc

# Pagination
GET /referrals?page=2&limit=20
```

### Response

**Status Code:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "data": {
    "referrals": [
      {
        "id": "ref-001",
        "patientFirstName": "Sarah",
        "patientLastName": "Johnson",
        "patientEmail": "sarah.johnson@email.com",
        "specialty": "Cardiology",
        "payer": "Blue Cross Blue Shield",
        "status": "Scheduled",
        "appointmentDate": "2025-11-22T10:30:00Z",
        "referralDate": "2025-11-10T14:00:00Z",
        "noShowRisk": 15
      },
      {
        "id": "ref-002",
        "patientFirstName": "Michael",
        "patientLastName": "Chen",
        "patientEmail": "michael.chen@email.com",
        "specialty": "Orthopedics",
        "payer": "UnitedHealthcare",
        "status": "Pending",
        "appointmentDate": "2025-11-25T14:00:00Z",
        "referralDate": "2025-11-15T09:30:00Z",
        "noShowRisk": 42
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 62,
      "totalPages": 2,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  },
  "message": "Referrals retrieved successfully"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request was successful |
| `data.referrals` | array | Array of referral objects |
| `data.referrals[].id` | string | Unique referral identifier |
| `data.referrals[].patientFirstName` | string | Patient's first name |
| `data.referrals[].patientLastName` | string | Patient's last name |
| `data.referrals[].patientEmail` | string | Patient's email address |
| `data.referrals[].specialty` | string | Medical specialty |
| `data.referrals[].payer` | string | Insurance payer name |
| `data.referrals[].status` | string | Referral status: `Pending`, `Scheduled`, `Completed`, `Cancelled` |
| `data.referrals[].appointmentDate` | string | Appointment date/time (ISO 8601) |
| `data.referrals[].referralDate` | string | Date referral was created (ISO 8601) |
| `data.referrals[].noShowRisk` | number | Predicted no-show risk percentage (0-100) |
| `data.pagination` | object | Pagination metadata |
| `data.pagination.page` | number | Current page number |
| `data.pagination.limit` | number | Results per page |
| `data.pagination.total` | number | Total number of referrals |
| `data.pagination.totalPages` | number | Total number of pages |
| `data.pagination.hasNextPage` | boolean | Whether there is a next page |
| `data.pagination.hasPreviousPage` | boolean | Whether there is a previous page |
| `message` | string | Success message |

### Error Response

**Status Code:** `400 Bad Request` | `500 Internal Server Error`

```json
{
  "success": false,
  "error": {
    "code": "INVALID_QUERY_PARAMS",
    "message": "Invalid status filter value",
    "statusCode": 400
  }
}
```

---

## 4. GET /referral/:id

**Description:** Returns detailed information about a specific referral/appointment including workflow steps, action log, and messages.

**Endpoint:** `GET /referral/:id`

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Referral unique identifier |

### Request Example

```bash
GET /referral/ref-001
```

### Response

**Status Code:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "data": {
    "id": "ref-001",
    "patientFirstName": "Sarah",
    "patientLastName": "Johnson",
    "patientEmail": "sarah.johnson@email.com",
    "age": 58,
    "specialty": "Cardiology",
    "payer": "Blue Cross Blue Shield",
    "plan": "Blue Cross PPO Plus",
    "status": "Scheduled",
    "urgency": "urgent",
    "appointmentDate": "2025-11-22T10:30:00Z",
    "referralDate": "2025-11-10T14:00:00Z",
    "noShowRisk": 15,
    "providerName": "Dr. James Mitchell",
    "facilityName": "Downtown Medical Center",
    "reason": "Chest pain and irregular heartbeat",
    "steps": [
      {
        "id": "step-1",
        "label": "Intake",
        "status": "completed",
        "completedAt": "2025-11-10T14:15:00Z",
        "description": "Initial referral received and processed"
      },
      {
        "id": "step-2",
        "label": "Eligibility",
        "status": "completed",
        "completedAt": "2025-11-11T09:30:00Z",
        "description": "Insurance eligibility verified"
      },
      {
        "id": "step-3",
        "label": "Prior Authorization",
        "status": "completed",
        "completedAt": "2025-11-13T16:45:00Z",
        "description": "PA approved for specialist consultation"
      },
      {
        "id": "step-4",
        "label": "Scheduled",
        "status": "current",
        "completedAt": "2025-11-15T11:20:00Z",
        "description": "Appointment scheduled with provider"
      },
      {
        "id": "step-5",
        "label": "Completed",
        "status": "upcoming",
        "description": "Appointment attended"
      }
    ],
    "actionLog": [
      {
        "id": "log-1",
        "event": "Referral Created",
        "type": "system",
        "timestamp": "2025-11-10T14:00:00Z",
        "user": "Dr. Emma Wilson",
        "description": "Referral created by primary care physician",
        "details": {
          "source": "EHR Integration"
        }
      },
      {
        "id": "log-2",
        "event": "Intake Completed",
        "type": "user",
        "timestamp": "2025-11-10T14:15:00Z",
        "user": "Linda Martinez",
        "description": "Patient demographics and insurance information verified"
      },
      {
        "id": "log-3",
        "event": "Eligibility Check Started",
        "type": "eligibility",
        "timestamp": "2025-11-11T09:00:00Z",
        "user": "System",
        "description": "Automated eligibility verification initiated"
      },
      {
        "id": "log-4",
        "event": "Eligibility Verified",
        "type": "eligibility",
        "timestamp": "2025-11-11T09:30:00Z",
        "user": "System",
        "description": "Insurance active, benefits confirmed",
        "details": {
          "copay": "$40",
          "coinsurance": "20%"
        }
      },
      {
        "id": "log-5",
        "event": "PA Request Submitted",
        "type": "pa",
        "timestamp": "2025-11-12T10:15:00Z",
        "user": "Sarah Chen",
        "description": "Prior authorization request submitted to payer"
      },
      {
        "id": "log-6",
        "event": "PA Approved",
        "type": "pa",
        "timestamp": "2025-11-13T16:45:00Z",
        "user": "Blue Cross Blue Shield",
        "description": "Prior authorization approved - Authorization #PA-2025-8847",
        "details": {
          "authNumber": "PA-2025-8847",
          "validUntil": "2026-02-13"
        }
      },
      {
        "id": "log-7",
        "event": "Appointment Scheduled",
        "type": "scheduling",
        "timestamp": "2025-11-15T11:20:00Z",
        "user": "Mike Johnson",
        "description": "Appointment scheduled for Nov 22, 2025 at 10:30 AM"
      },
      {
        "id": "log-8",
        "event": "Confirmation SMS Sent",
        "type": "message",
        "timestamp": "2025-11-15T11:25:00Z",
        "user": "System",
        "description": "Appointment confirmation sent via SMS"
      },
      {
        "id": "log-9",
        "event": "Reminder Email Sent",
        "type": "message",
        "timestamp": "2025-11-19T09:00:00Z",
        "user": "System",
        "description": "3-day appointment reminder sent via email"
      },
      {
        "id": "log-10",
        "event": "Patient Confirmed Attendance",
        "type": "message",
        "timestamp": "2025-11-19T14:30:00Z",
        "user": "Sarah Johnson",
        "description": "Patient replied 'YES' to confirmation request"
      }
    ],
    "messages": [
      {
        "id": "msg-1",
        "channel": "SMS",
        "content": "Hi Sarah, your cardiology appointment with Dr. James Mitchell is scheduled for Nov 22 at 10:30 AM at Downtown Medical Center. Please reply YES to confirm or CANCEL to reschedule.",
        "timestamp": "2025-11-15T11:25:00Z",
        "status": "delivered",
        "direction": "outbound",
        "recipient": "sarah.johnson@email.com"
      },
      {
        "id": "msg-2",
        "channel": "SMS",
        "content": "YES",
        "timestamp": "2025-11-19T14:30:00Z",
        "status": "delivered",
        "direction": "inbound"
      },
      {
        "id": "msg-3",
        "channel": "Email",
        "content": "Dear Sarah Johnson,\\n\\nThis is a reminder that you have an appointment scheduled:\\n\\nDate: Friday, November 22, 2025\\nTime: 10:30 AM\\nProvider: Dr. James Mitchell\\nLocation: Downtown Medical Center, 123 Main St\\nSpecialty: Cardiology\\n\\nPlease bring your insurance card and a valid ID. If you need to reschedule, please call us at (555) 123-4567.\\n\\nThank you!",
        "timestamp": "2025-11-19T09:00:00Z",
        "status": "delivered",
        "direction": "outbound",
        "recipient": "sarah.johnson@email.com"
      }
    ]
  },
  "message": "Referral details retrieved successfully"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request was successful |
| `data.id` | string | Unique referral identifier |
| `data.patientFirstName` | string | Patient's first name |
| `data.patientLastName` | string | Patient's last name |
| `data.patientEmail` | string | Patient's email address |
| `data.age` | number | Patient's age |
| `data.specialty` | string | Medical specialty |
| `data.payer` | string | Insurance payer name |
| `data.plan` | string | Insurance plan name |
| `data.status` | string | Referral status: `Pending`, `Scheduled`, `Completed`, `Cancelled` |
| `data.urgency` | string | Urgency level: `routine`, `urgent`, or `stat` |
| `data.appointmentDate` | string | Appointment date/time (ISO 8601) |
| `data.referralDate` | string | Date referral was created (ISO 8601) |
| `data.noShowRisk` | number | Predicted no-show risk percentage (0-100) |
| `data.providerName` | string | Provider's name |
| `data.facilityName` | string | Facility name |
| `data.reason` | string | Reason for referral |
| `data.steps` | array | Workflow steps for this referral |
| `data.steps[].id` | string | Step identifier |
| `data.steps[].label` | string | Step display name |
| `data.steps[].status` | string | Step status: `completed`, `current`, `upcoming` |
| `data.steps[].completedAt` | string | Timestamp when step was completed (ISO 8601) |
| `data.steps[].description` | string | Step description |
| `data.actionLog` | array | Complete action history for this referral |
| `data.actionLog[].id` | string | Log entry identifier |
| `data.actionLog[].event` | string | Event name |
| `data.actionLog[].type` | string | Event type: `eligibility`, `pa`, `scheduling`, `message`, `system`, `user` |
| `data.actionLog[].timestamp` | string | When the event occurred (ISO 8601) |
| `data.actionLog[].user` | string | User or system that triggered the event |
| `data.actionLog[].description` | string | Event description |
| `data.actionLog[].details` | object | Additional event metadata (optional) |
| `data.messages` | array | Communication history |
| `data.messages[].id` | string | Message identifier |
| `data.messages[].channel` | string | Communication channel: `SMS` or `Email` |
| `data.messages[].content` | string | Message content |
| `data.messages[].timestamp` | string | When the message was sent/received (ISO 8601) |
| `data.messages[].status` | string | Message status: `sent`, `delivered`, `failed`, `pending` |
| `data.messages[].direction` | string | Message direction: `inbound` or `outbound` |
| `data.messages[].recipient` | string | Recipient email or phone (optional for inbound) |
| `message` | string | Success message |

### Error Response

**Status Code:** `404 Not Found` | `500 Internal Server Error`

```json
{
  "success": false,
  "error": {
    "code": "REFERRAL_NOT_FOUND",
    "message": "Referral with ID 'ref-001' not found",
    "statusCode": 404
  }
}
```

---

## 5. GET /referral/:id/logs

**Description:** Returns the event logs (action log) of a specific referral/appointment. This is a filtered version of the action log from the referral details, useful for displaying audit trails and activity feeds.

**Endpoint:** `GET /referral/:id/logs`

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Referral unique identifier |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | No | Filter by event type: `eligibility`, `pa`, `scheduling`, `message`, `system`, `user` (comma-separated) |
| `limit` | number | No | Maximum number of logs to return (default: 100) |
| `offset` | number | No | Offset for pagination (default: 0) |
| `sortOrder` | string | No | Sort order: `asc` or `desc` (default: `desc` - newest first) |
| `dateFrom` | string | No | Filter logs from this date (ISO 8601) |
| `dateTo` | string | No | Filter logs until this date (ISO 8601) |

### Request Example

```bash
# Get all logs for referral
GET /referral/ref-001/logs

# Get only PA-related logs
GET /referral/ref-001/logs?type=pa

# Get logs with pagination
GET /referral/ref-001/logs?limit=20&offset=0

# Get logs in ascending order (oldest first)
GET /referral/ref-001/logs?sortOrder=asc
```

### Response

**Status Code:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "data": {
    "referralId": "ref-001",
    "logs": [
      {
        "id": "log-10",
        "event": "Patient Confirmed Attendance",
        "type": "message",
        "timestamp": "2025-11-19T14:30:00Z",
        "user": "Sarah Johnson",
        "description": "Patient replied 'YES' to confirmation request",
        "details": null
      },
      {
        "id": "log-9",
        "event": "Reminder Email Sent",
        "type": "message",
        "timestamp": "2025-11-19T09:00:00Z",
        "user": "System",
        "description": "3-day appointment reminder sent via email",
        "details": null
      },
      {
        "id": "log-8",
        "event": "Confirmation SMS Sent",
        "type": "message",
        "timestamp": "2025-11-15T11:25:00Z",
        "user": "System",
        "description": "Appointment confirmation sent via SMS",
        "details": null
      },
      {
        "id": "log-7",
        "event": "Appointment Scheduled",
        "type": "scheduling",
        "timestamp": "2025-11-15T11:20:00Z",
        "user": "Mike Johnson",
        "description": "Appointment scheduled for Nov 22, 2025 at 10:30 AM",
        "details": null
      },
      {
        "id": "log-6",
        "event": "PA Approved",
        "type": "pa",
        "timestamp": "2025-11-13T16:45:00Z",
        "user": "Blue Cross Blue Shield",
        "description": "Prior authorization approved - Authorization #PA-2025-8847",
        "details": {
          "authNumber": "PA-2025-8847",
          "validUntil": "2026-02-13"
        }
      },
      {
        "id": "log-5",
        "event": "PA Request Submitted",
        "type": "pa",
        "timestamp": "2025-11-12T10:15:00Z",
        "user": "Sarah Chen",
        "description": "Prior authorization request submitted to payer",
        "details": null
      },
      {
        "id": "log-4",
        "event": "Eligibility Verified",
        "type": "eligibility",
        "timestamp": "2025-11-11T09:30:00Z",
        "user": "System",
        "description": "Insurance active, benefits confirmed",
        "details": {
          "copay": "$40",
          "coinsurance": "20%"
        }
      },
      {
        "id": "log-3",
        "event": "Eligibility Check Started",
        "type": "eligibility",
        "timestamp": "2025-11-11T09:00:00Z",
        "user": "System",
        "description": "Automated eligibility verification initiated",
        "details": null
      },
      {
        "id": "log-2",
        "event": "Intake Completed",
        "type": "user",
        "timestamp": "2025-11-10T14:15:00Z",
        "user": "Linda Martinez",
        "description": "Patient demographics and insurance information verified",
        "details": null
      },
      {
        "id": "log-1",
        "event": "Referral Created",
        "type": "system",
        "timestamp": "2025-11-10T14:00:00Z",
        "user": "Dr. Emma Wilson",
        "description": "Referral created by primary care physician",
        "details": {
          "source": "EHR Integration"
        }
      }
    ],
    "pagination": {
      "limit": 100,
      "offset": 0,
      "total": 10,
      "hasMore": false
    }
  },
  "message": "Logs retrieved successfully"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request was successful |
| `data.referralId` | string | Referral identifier |
| `data.logs` | array | Array of log entries |
| `data.logs[].id` | string | Log entry identifier |
| `data.logs[].event` | string | Event name |
| `data.logs[].type` | string | Event type: `eligibility`, `pa`, `scheduling`, `message`, `system`, `user` |
| `data.logs[].timestamp` | string | When the event occurred (ISO 8601) |
| `data.logs[].user` | string | User or system that triggered the event |
| `data.logs[].description` | string | Event description |
| `data.logs[].details` | object \| null | Additional event metadata |
| `data.pagination` | object | Pagination metadata |
| `data.pagination.limit` | number | Maximum results returned |
| `data.pagination.offset` | number | Current offset |
| `data.pagination.total` | number | Total number of logs matching filters |
| `data.pagination.hasMore` | boolean | Whether there are more logs to fetch |
| `message` | string | Success message |

### Error Response

**Status Code:** `404 Not Found` | `400 Bad Request` | `500 Internal Server Error`

```json
{
  "success": false,
  "error": {
    "code": "REFERRAL_NOT_FOUND",
    "message": "Referral with ID 'ref-001' not found",
    "statusCode": 404
  }
}
```

---

## Common Response Formats

### Standard Success Response

All successful responses follow this structure:

```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "message": "Operation completed successfully"
}
```

### Standard Error Response

All error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* optional additional context */ },
    "statusCode": 400
  }
}
```

---

## Data Types Reference

### Status Values
- `Pending` - Referral is being processed
- `Scheduled` - Appointment has been scheduled
- `Completed` - Appointment was attended
- `Cancelled` - Referral/appointment was cancelled

### Urgency Levels
- `routine` - Standard priority
- `urgent` - High priority, needs expedited processing
- `stat` - Immediate attention required

### Event Types (Action Log)
- `system` - System-generated events
- `user` - User actions
- `eligibility` - Insurance eligibility events
- `pa` - Prior authorization events
- `scheduling` - Appointment scheduling events
- `message` - Communication events

### Step Status
- `completed` - Step is finished
- `current` - Step is currently in progress
- `upcoming` - Step has not started yet

### Message Status
- `sent` - Message was sent
- `delivered` - Message was delivered to recipient
- `failed` - Message delivery failed
- `pending` - Message is queued for delivery

### Message Direction
- `outbound` - Sent from system to patient
- `inbound` - Received from patient to system

---

## Implementation Notes

### Authentication
All endpoints require authentication. Include a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Rate Limiting
- Standard endpoints: 100 requests per minute
- Upload endpoint: 10 requests per minute
- Orchestrate endpoint: 20 requests per minute

### File Upload Limits
- Maximum file size: 10MB
- Accepted format: PDF only
- Maximum pages: 50 pages per document

### Date/Time Format
All date/time values use ISO 8601 format with timezone:
- Format: `YYYY-MM-DDTHH:mm:ssZ`
- Example: `2025-11-22T10:30:00Z`
- Timezone: UTC

### Pagination
Endpoints that return lists support pagination:
- Default page size: 50 items
- Maximum page size: 100 items
- Use `page` and `limit` query parameters

### Error Handling
- 4xx errors: Client errors (invalid input, not found, etc.)
- 5xx errors: Server errors (processing failures, external service errors, etc.)
- Always check `success` field before accessing `data`

---

## Testing & Examples

### Example cURL Commands

# 1. Upload a referral document

```bash
curl -X POST http://localhost:3000/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@referral-form.pdf"
```

# 2. Orchestrate the referral process

```bash
curl -X POST http://localhost:3000/orchestrate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": "doc-12345678",
    "referralData": {
      "patientFirstName": "Sarah",
      "patientLastName": "Johnson",
      "patientEmail": "sarah.johnson@email.com",
      "age": 58,
      "specialty": "Cardiology",
      "payer": "Blue Cross Blue Shield",
      "plan": "Blue Cross PPO Plus",
      "urgency": "urgent",
      "appointmentDate": null,
      "referralDate": "2025-11-10T14:00:00Z",
      "providerName": "Dr. James Mitchell",
      "facilityName": "Downtown Medical Center",
      "reason": "Chest pain and irregular heartbeat"
    },
    "autoSchedule": true,
    "sendNotifications": true
  }'
```

# 3. Get all referrals
```bash
curl -X GET "http://localhost:3000/referrals?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```bash
# 4. Get referral details
curl -X GET http://localhost:3000/referral/ref-001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```bash
# 5. Get referral logs
curl -X GET "http://localhost:3000/referral/ref-001/logs?type=pa,eligibility" \
  -H "Authorization: Bearer YOUR_TOKEN"
```