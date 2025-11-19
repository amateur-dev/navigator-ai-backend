# Navigator-AI Backend API

## Base URL
`http://localhost:3000` (Local)

## Endpoints

### Healthcheck
- **GET** `/ping`
- **Response**: `pong`

### File Upload
- **POST** `/upload`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (The document to upload)
- **Response**:
  ```json
  {
    "message": "File uploaded successfully",
    "filename": "referral.pdf"
  }
  ```

### AI Extraction
- **POST** `/extract`
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "filename": "referral.pdf"
  }
  ```
- **Response**:
  ```json
  {
    "patientName": "John Doe",
    "dateOfBirth": "1980-01-01",
    "referralReason": "Cardiology consultation",
    "insuranceProvider": "BlueCross"
  }
  ```

### Workflow Orchestration
- **POST** `/orchestrate`
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "patientName": "John Doe",
    "referralReason": "Cardiology consultation",
    "insuranceProvider": "BlueCross"
  }
  ```
- **Response**:
  ```json
  {
    "specialist": "Cardiologist",
    "insuranceStatus": "Approved",
    "availableSlots": [
      "2025-11-20T10:00:00Z",
      "2025-11-21T14:00:00Z"
    ]
  }
  ```

### Message Confirmation
- **POST** `/confirm`
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "patientName": "John Doe",
    "slot": "2025-11-20T10:00:00Z"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Confirmation sent successfully",
    "status": "Sent"
  }
  ```
