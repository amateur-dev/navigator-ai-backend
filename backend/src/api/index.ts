import { Service } from '@liquidmetal-ai/raindrop-framework';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { QueueSendOptions } from '@liquidmetal-ai/raindrop-framework';
import { KvCachePutOptions, KvCacheGetOptions } from '@liquidmetal-ai/raindrop-framework';
import { BucketPutOptions, BucketListOptions } from '@liquidmetal-ai/raindrop-framework';
import { Env } from './raindrop.gen';
import {
  MOCK_UPLOAD_RESPONSE,
  MOCK_ORCHESTRATION_RESPONSE,
  MOCK_REFERRALS_LIST,
  MOCK_REFERRAL_DETAILS,
  MOCK_REFERRAL_LOGS
} from './mockData';

// Create Hono app with middleware
const app = new Hono<{ Bindings: Env }>();

// Add request logging middleware
app.use('*', logger());

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// === Navigator-AI Backend Endpoints ===

// Ping endpoint
app.get('/ping', (c) => {
  return c.text('pong');
});

// File upload endpoint
app.post('/upload', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return c.text('No file uploaded', 400);
    }

    // Upload to SmartBucket (referral-docs)
    const smartbucket = c.env.REFERRAL_DOCS;
    const arrayBuffer = await file.arrayBuffer();

    await smartbucket.put(file.name, new Uint8Array(arrayBuffer), {
      httpMetadata: {
        contentType: file.type || 'application/pdf',
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });

    // Return success - extraction will happen via /extract endpoint
    return c.json({
      success: true,
      message: 'File uploaded successfully',
      filename: file.name,
      uploadedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({
      success: false,
      error: {
        code: "UPLOAD_FAILED",
        message: "Failed to process document",
        statusCode: 500
      }
    }, 500);
  }
});

// AI Extraction endpoint
app.post('/extract', async (c) => {
  try {
    const body = await c.req.json();
    const { filename } = body;

    if (!filename) {
      return c.text('Filename is required', 400);
    }

    // Use SmartBucket AI to extract data
    const smartbucket = c.env.REFERRAL_DOCS;

    // We need the object ID, which in this case is the filename (key)
    // Note: In a real app, we might want to verify the file exists first

    const prompt = `
      Carefully read this medical referral document and extract EXACTLY the following information as it appears in the document:
      
      1. Patient Full Name (First and Last Name)
      2. Patient Date of Birth (in YYYY-MM-DD format)
      3. Referral Reason - the medical condition, diagnosis, or symptoms mentioned
      4. Insurance Provider/Payer name
      
      Look for sections labeled:
      - "PATIENT INFORMATION" or "Patient Name" for the name
      - "DOB" or "Date of Birth" for birth date
      - "REFERRAL TO" or "Reason" for the medical condition
      - "Insurance" or "Payer" for insurance information
      
      Return ONLY a JSON object with these exact keys:
      {
        "patientName": "exact name from document",
        "dateOfBirth": "YYYY-MM-DD",
        "referralReason": "exact reason from document",
        "insuranceProvider": "exact insurance name from document"
      }
      
      Do not add any explanation, markdown formatting, or additional text. Just the JSON object.
    `;

    const requestId = `extract-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const response = await smartbucket.documentChat({
      objectId: filename,
      input: prompt,
      requestId
    });

    console.log('AI Raw Response:', JSON.stringify(response, null, 2));

    // Parse the AI response
    let extractedData;
    try {
      // Check if answer is already an object
      if (typeof response.answer === 'object') {
        extractedData = response.answer;
      } else {
        // Clean up potential markdown code blocks if the AI adds them
        const cleanJson = response.answer.replace(/```json\n|\n```/g, '').replace(/```/g, '').trim();
        console.log('Cleaned JSON string:', cleanJson);
        extractedData = JSON.parse(cleanJson);
      }
    } catch (e) {
      console.error('Failed to parse AI response:', response.answer);
      // Fallback: try to find JSON-like structure in text
      try {
        const jsonMatch = response.answer.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          extractedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch (retryError) {
        return c.json({
          error: 'Failed to parse extracted data',
          rawResponse: response.answer
        }, 500);
      }
    }

    console.log('Extracted Data:', extractedData);

    return c.json(extractedData);
  } catch (error) {
    console.error('Extract error:', error);
    return c.text('Extraction failed: ' + (error instanceof Error ? error.message : String(error)), 500);
  }
});

// Workflow Orchestration endpoint
app.post('/orchestrate', async (c) => {
  try {
    const body = await c.req.json();
    const { patientName, referralReason, insuranceProvider } = body;

    if (!patientName || !referralReason) {
      return c.json({
        success: false,
        error: {
          code: "INVALID_REQUEST",
          message: "Missing required fields",
          statusCode: 400
        }
      }, 400);
    }

    // 1. Determine Specialist based on condition (Expanded keyword matching)
    let specialty = 'General Practitioner';
    const reasonLower = referralReason.toLowerCase();

    const specialtyMap: Record<string, string[]> = {
      'Cardiologist': ['heart', 'cardio', 'chest', 'palpitation', 'pulse', 'pressure'],
      'Dermatologist': ['skin', 'derma', 'rash', 'itch', 'acne', 'mole', 'lesion'],
      'Orthopedist': ['bone', 'joint', 'knee', 'back', 'spine', 'fracture', 'ortho', 'shoulder', 'hip'],
      'Neurologist': ['headache', 'migraine', 'seizure', 'numbness', 'dizzy', 'brain', 'nerve', 'neuro'],
      'Pediatrician': ['child', 'baby', 'infant', 'toddler', 'pediatric', 'growth'],
      'Psychiatrist': ['mental', 'depress', 'anxiety', 'mood', 'psych', 'behavior'],
      'Oncologist': ['cancer', 'tumor', 'lump', 'onco', 'chemo', 'radiation'],
      'Gastroenterologist': ['stomach', 'gut', 'digest', 'bowel', 'reflux', 'gastro', 'liver'],
      'Pulmonologist': ['lung', 'breath', 'asthma', 'cough', 'pulmo', 'respiratory'],
      'Urologist': ['urine', 'bladder', 'kidney', 'prostate', 'uro'],
      'Ophthalmologist': ['eye', 'vision', 'sight', 'blind', 'optic'],
      'ENT Specialist': ['ear', 'nose', 'throat', 'sinus', 'hearing'],
      'Endocrinologist': ['diabetes', 'thyroid', 'hormone', 'sugar', 'endo'],
      'Rheumatologist': ['arthritis', 'autoimmune', 'lupus', 'rheum'],
    };

    for (const [spec, keywords] of Object.entries(specialtyMap)) {
      if (keywords.some(k => reasonLower.includes(k))) {
        specialty = spec;
        break;
      }
    }

    // 2. Check Insurance (Mock logic)
    const insuranceStatus = (insuranceProvider && insuranceProvider.toLowerCase().includes('blue')) ? 'Approved' : 'Pending Review';

    // 3. Find Available Slots from DB
    const db = c.env.REFERRALS_DB as any;

    // Find specialists with the matching specialty
    // Note: Using inline parameters for MVP as parameter syntax is unconfirmed
    const specialistsResult = await db.executeQuery({
      sqlQuery: `SELECT * FROM specialists WHERE specialty = '${specialty}'`
    });

    let availableSlots: any[] = [];
    let selectedSpecialist = null;

    // Helper to extract rows from SQL result
    const getRows = (result: any) => {
      if (Array.isArray(result)) return result;
      if (result && result.results) {
        if (Array.isArray(result.results)) return result.results;
        if (typeof result.results === 'string') {
          try {
            return JSON.parse(result.results);
          } catch (e) {
            console.error('Failed to parse SQL results:', e);
            return [];
          }
        }
      }
      if (result && Array.isArray(result.rows)) return result.rows;
      return [];
    };

    // Check if we have results (handling potential response formats)
    const specialists = getRows(specialistsResult);

    if (specialists.length > 0) {
      selectedSpecialist = specialists[0];

      // Find slots for this specialist
      const slotsResult = await db.executeQuery({
        sqlQuery: `SELECT * FROM slots WHERE specialist_id = ${selectedSpecialist.id} AND is_booked = 0 AND start_time > '${new Date().toISOString()}' ORDER BY start_time ASC LIMIT 3`
      });

      const slots = getRows(slotsResult);
      availableSlots = slots.map((slot: any) => slot.start_time);
    }

    // 4. Create Referral Record in DB
    const insertQuery = `INSERT INTO referrals (patient_name, condition, insurance_provider, specialist_id, status) 
       VALUES ('${patientName}', '${referralReason}', '${insuranceProvider}', ${selectedSpecialist ? selectedSpecialist.id : 'NULL'}, 'Pending')`;

    await db.executeQuery({ sqlQuery: insertQuery });

    // SQLite specific: Get last ID
    const idResult = await db.executeQuery({ sqlQuery: 'SELECT last_insert_rowid() as id' });
    const idRows = getRows(idResult);
    const referralId = idRows[0]?.id || 'unknown';

    return c.json({
      success: true,
      data: {
        referralId: `ref-${referralId}`,
        status: 'Processed',
        specialist: specialty,
        assignedDoctor: selectedSpecialist ? selectedSpecialist.name : 'Pending Assignment',
        insuranceStatus,
        availableSlots,
        debug: {
          specialtyUsed: specialty,
          specialistsFound: specialists.length,
          slotsFound: availableSlots.length
        }
      },
      message: 'Referral orchestration completed successfully'
    });

  } catch (error) {
    console.error('Orchestrate error:', error);
    return c.json({
      success: false,
      error: {
        code: "ORCHESTRATION_FAILED",
        message: "Failed to start orchestration: " + (error instanceof Error ? error.message : String(error)),
        statusCode: 500
      }
    }, 500);
  }
});

// Database Seeding Endpoint (For Demo Setup)
app.post('/seed', async (c) => {
  try {
    const db = c.env.REFERRALS_DB as any;

    // 1. Create Tables (SQLite Syntax)
    await db.executeQuery({
      sqlQuery: `
      CREATE TABLE IF NOT EXISTS specialists (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          specialty TEXT NOT NULL,
          email TEXT
      );
    `});

    await db.executeQuery({
      sqlQuery: `
      CREATE TABLE IF NOT EXISTS slots (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          specialist_id INTEGER REFERENCES specialists(id),
          start_time TEXT NOT NULL,
          is_booked INTEGER DEFAULT 0
      );
    `});

    await db.executeQuery({
      sqlQuery: `
      CREATE TABLE IF NOT EXISTS referrals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_name TEXT NOT NULL,
          dob TEXT,
          condition TEXT,
          insurance_provider TEXT,
          specialist_id INTEGER REFERENCES specialists(id),
          slot_id INTEGER REFERENCES slots(id),
          status TEXT DEFAULT 'Pending',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `});

    // 2. Clear existing data
    await db.executeQuery({ sqlQuery: 'DELETE FROM slots' });
    await db.executeQuery({ sqlQuery: 'DELETE FROM referrals' });
    await db.executeQuery({ sqlQuery: 'DELETE FROM specialists' });

    // 3. Insert Specialists (Fixed list for consistency)
    const doctors = [
      // Cardiologists (2)
      { name: 'Dr. James Mitchell', specialty: 'Cardiologist', email: 'james.mitchell@hospital.com' },
      { name: 'Dr. Sarah Rodriguez', specialty: 'Cardiologist', email: 'sarah.rodriguez@hospital.com' },

      // Dermatologists (2)
      { name: 'Dr. Emily Chen', specialty: 'Dermatologist', email: 'emily.chen@hospital.com' },
      { name: 'Dr. Michael Smith', specialty: 'Dermatologist', email: 'michael.smith@hospital.com' },

      // Orthopedists (2)
      { name: 'Dr. David Johnson', specialty: 'Orthopedist', email: 'david.johnson@hospital.com' },
      { name: 'Dr. Jessica Williams', specialty: 'Orthopedist', email: 'jessica.williams@hospital.com' },

      // Neurologists (2)
      { name: 'Dr. Jennifer Brown', specialty: 'Neurologist', email: 'jennifer.brown@hospital.com' },
      { name: 'Dr. Robert Jones', specialty: 'Neurologist', email: 'robert.jones@hospital.com' },

      // Pediatricians (2)
      { name: 'Dr. William Garcia', specialty: 'Pediatrician', email: 'william.garcia@hospital.com' },
      { name: 'Dr. Elizabeth Miller', specialty: 'Pediatrician', email: 'elizabeth.miller@hospital.com' },

      // Psychiatrists (2)
      { name: 'Dr. John Davis', specialty: 'Psychiatrist', email: 'john.davis@hospital.com' },
      { name: 'Dr. Linda Rodriguez', specialty: 'Psychiatrist', email: 'linda.rodriguez@hospital.com' },

      // Oncologists (2)
      { name: 'Dr. Richard Martinez', specialty: 'Oncologist', email: 'richard.martinez@hospital.com' },
      { name: 'Dr. Barbara Hernandez', specialty: 'Oncologist', email: 'barbara.hernandez@hospital.com' },

      // Gastroenterologists (2)
      { name: 'Dr. Thomas Lopez', specialty: 'Gastroenterologist', email: 'thomas.lopez@hospital.com' },
      { name: 'Dr. Sarah Lee', specialty: 'Gastroenterologist', email: 'sarah.lee@hospital.com' },

      // Pulmonologists (2)
      { name: 'Dr. Emily White', specialty: 'Pulmonologist', email: 'emily.white@hospital.com' },
      { name: 'Dr. Michael Brown', specialty: 'Pulmonologist', email: 'michael.brown@hospital.com' },

      // Urologists (2)
      { name: 'Dr. David Wilson', specialty: 'Urologist', email: 'david.wilson@hospital.com' },
      { name: 'Dr. Jessica Taylor', specialty: 'Urologist', email: 'jessica.taylor@hospital.com' },

      // Ophthalmologists (2)
      { name: 'Dr. Jennifer Anderson', specialty: 'Ophthalmologist', email: 'jennifer.anderson@hospital.com' },
      { name: 'Dr. Robert Thomas', specialty: 'Ophthalmologist', email: 'robert.thomas@hospital.com' },

      // ENT Specialists (2)
      { name: 'Dr. William Jackson', specialty: 'ENT Specialist', email: 'william.jackson@hospital.com' },
      { name: 'Dr. Elizabeth Harris', specialty: 'ENT Specialist', email: 'elizabeth.harris@hospital.com' },

      // Endocrinologists (2)
      { name: 'Dr. John Martin', specialty: 'Endocrinologist', email: 'john.martin@hospital.com' },
      { name: 'Dr. Linda Thompson', specialty: 'Endocrinologist', email: 'linda.thompson@hospital.com' },

      // Rheumatologists (2)
      { name: 'Dr. Richard Garcia', specialty: 'Rheumatologist', email: 'richard.garcia@hospital.com' },
      { name: 'Dr. Barbara Martinez', specialty: 'Rheumatologist', email: 'barbara.martinez@hospital.com' },

      // General Practitioners (2)
      { name: 'Dr. Thomas Robinson', specialty: 'General Practitioner', email: 'thomas.robinson@hospital.com' },
      { name: 'Dr. Sarah Clark', specialty: 'General Practitioner', email: 'sarah.clark@hospital.com' },
    ];

    // Insert all doctors
    for (const doc of doctors) {
      await db.executeQuery({
        sqlQuery: `INSERT INTO specialists (name, specialty, email) VALUES ('${doc.name}', '${doc.specialty}', '${doc.email}')`
      });
    }

    // Get all IDs for slot generation
    const allSpecsRes = await db.executeQuery({ sqlQuery: 'SELECT id FROM specialists' });
    const getRows = (result: any) => { // Re-define getRows locally for seed endpoint
      if (Array.isArray(result)) return result;
      if (result && result.results) {
        if (Array.isArray(result.results)) return result.results;
        if (typeof result.results === 'string') {
          try {
            return JSON.parse(result.results);
          } catch (e) {
            console.error('Failed to parse SQL results:', e);
            return [];
          }
        }
      }
      if (result && Array.isArray(result.rows)) return result.rows;
      return [];
    };
    const allSpecs = getRows(allSpecsRes);

    // 4. Insert Slots (Future dates) for random specialists
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Generate slots for 50% of doctors
    for (const doc of allSpecs) {
      if (Math.random() > 0.5) continue;

      for (let i = 0; i < 3; i++) {
        const slotDate = new Date(tomorrow);
        slotDate.setDate(slotDate.getDate() + Math.floor(Math.random() * 7)); // Random day in next week
        slotDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0); // Random hour 9-17

        await db.executeQuery({ sqlQuery: `INSERT INTO slots (specialist_id, start_time) VALUES (${doc.id}, '${slotDate.toISOString()}')` });
      }
    }

    return c.json({ message: `Database seeded successfully with ${allSpecs.length} specialists` });
  } catch (error) {
    console.error('Seed error:', error);
    return c.json({ error: 'Seeding failed: ' + (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// Get all referrals
app.get('/referrals', (c) => {
  return c.json(MOCK_REFERRALS_LIST);
});

// Get referral details
app.get('/referral/:id', (c) => {
  const id = c.req.param('id');
  if (id === 'ref-001') {
    return c.json(MOCK_REFERRAL_DETAILS);
  }
  return c.json({
    success: false,
    error: {
      code: "REFERRAL_NOT_FOUND",
      message: `Referral with ID '${id}' not found`,
      statusCode: 404
    }
  }, 404);
});

// Get referral logs
app.get('/referral/:id/logs', (c) => {
  const id = c.req.param('id');
  if (id === 'ref-001') {
    return c.json(MOCK_REFERRAL_LOGS);
  }
  return c.json({
    success: false,
    error: {
      code: "REFERRAL_NOT_FOUND",
      message: `Referral with ID '${id}' not found`,
      statusCode: 404
    }
  }, 404);
});

// Patient Confirmation endpoint
// Confirmation endpoint - Demo mode (shows what would be sent)
app.post('/confirm', async (c) => {
  try {
    const body = await c.req.json();
    const {
      referralId,
      patientName,
      patientEmail,
      patientPhone,
      doctorName,
      specialty,
      appointmentDate,
      appointmentTime,
      facilityName,
      facilityAddress
    } = body;

    if (!patientName || !doctorName) {
      return c.json({
        success: false,
        error: 'Missing required fields: patientName and doctorName'
      }, 400);
    }

    // Format appointment datetime
    const apptDate = appointmentDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 2 days from now
    const apptTime = appointmentTime || '10:00 AM';
    const facility = facilityName || 'Downtown Medical Center';
    const address = facilityAddress || '123 Main Street, Suite 200, New York, NY 10001';
    const phone = patientPhone || '+1-555-0123';
    const email = patientEmail || 'patient@email.com';

    // Generate realistic SMS message
    const smsMessage = `Hi ${patientName}! Your ${specialty || 'medical'} appointment with ${doctorName} is confirmed for ${apptDate} at ${apptTime} at ${facility}. Location: ${address}. Questions? Call (555) 123-4567. Reply CANCEL to reschedule.`;

    // Generate realistic email
    const emailSubject = `Appointment Confirmed - ${doctorName}`;
    const emailBody = `Dear ${patientName},

Your appointment has been successfully confirmed!

APPOINTMENT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Doctor:        ${doctorName}
Specialty:     ${specialty || 'General Practice'}
Date & Time:   ${apptDate} at ${apptTime}
Location:      ${facility}
Address:       ${address}

IMPORTANT REMINDERS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Please arrive 15 minutes early for check-in
• Bring your insurance card and photo ID
• Bring a list of current medications
• If you need to cancel or reschedule, please call us at least 24 hours in advance

CONTACT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phone: (555) 123-4567
Email: appointments@hospital.com
Portal: https://patient-portal.hospital.com

We look forward to seeing you!

Best regards,
${facility} Team

---
Referral ID: ${referralId || 'N/A'}
This is an automated confirmation. Please do not reply to this email.`;

    // Return demo response
    return c.json({
      success: true,
      confirmationSent: true,
      referralId: referralId || 'demo-' + Date.now(),
      notifications: {
        sms: {
          to: phone,
          message: smsMessage,
          length: smsMessage.length,
          estimatedCost: '$0.0075'
        },
        email: {
          to: email,
          subject: emailSubject,
          body: emailBody,
          format: 'text/plain'
        }
      },
      appointmentDetails: {
        patient: patientName,
        doctor: doctorName,
        specialty: specialty || 'General Practice',
        dateTime: `${apptDate} at ${apptTime}`,
        location: facility,
        address: address
      },
      method: 'DEMO_MODE',
      message: 'In production, SMS and Email would be sent via Twilio/SendGrid',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Confirm error:', error);
    return c.json({
      success: false,
      error: 'Confirmation failed: ' + (error instanceof Error ? error.message : String(error))
    }, 500);
  }
});

// === Basic API Routes ===
app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Hono!' });
});

app.get('/api/hello/:name', (c) => {
  const name = c.req.param('name');
  return c.json({ message: `Hello, ${name}!` });
});

// Example POST endpoint
app.post('/api/echo', async (c) => {
  const body = await c.req.json();
  return c.json({ received: body });
});

// === RPC Examples: Service calling Actor ===
// Example: Call an actor method
/*
app.post('/api/actor-call', async (c) => {
  try {
    const { message, actorName } = await c.req.json();

    if (!actorName) {
      return c.json({ error: 'actorName is required' }, 400);
    }

    // Get actor namespace and create actor instance
    // Note: Replace MY_ACTOR with your actual actor binding name
    const actorNamespace = c.env.MY_ACTOR; // This would be bound in raindrop.manifest
    const actorId = actorNamespace.idFromName(actorName);
    const actor = actorNamespace.get(actorId);

    // Call actor method (assuming actor has a 'processMessage' method)
    const response = await actor.processMessage(message);

    return c.json({
      success: true,
      actorName,
      response
    });
  } catch (error) {
    return c.json({
      error: 'Failed to call actor',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/

// Example: Get actor state
/*
app.get('/api/actor-state/:actorName', async (c) => {
  try {
    const actorName = c.req.param('actorName');

    // Get actor instance
    const actorNamespace = c.env.MY_ACTOR;
    const actorId = actorNamespace.idFromName(actorName);
    const actor = actorNamespace.get(actorId);

    // Get actor state (assuming actor has a 'getState' method)
    const state = await actor.getState();

    return c.json({
      success: true,
      actorName,
      state
    });
  } catch (error) {
    return c.json({
      error: 'Failed to get actor state',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/

// === SmartBucket Examples ===
// Example: Upload file to SmartBucket
/*
app.post('/api/upload', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Upload to SmartBucket (Replace MY_SMARTBUCKET with your binding name)
    const smartbucket = c.env.MY_SMARTBUCKET;
    const arrayBuffer = await file.arrayBuffer();

    const putOptions: BucketPutOptions = {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
      },
      customMetadata: {
        originalName: file.name,
        size: file.size.toString(),
        description: description || '',
        uploadedAt: new Date().toISOString()
      }
    };

    const result = await smartbucket.put(file.name, new Uint8Array(arrayBuffer), putOptions);

    return c.json({
      success: true,
      message: 'File uploaded successfully',
      key: result.key,
      size: result.size,
      etag: result.etag
    });
  } catch (error) {
    return c.json({
      error: 'Failed to upload file',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/

// Example: Get file from SmartBucket
/*
app.get('/api/file/:filename', async (c) => {
  try {
    const filename = c.req.param('filename');

    // Get file from SmartBucket
    const smartbucket = c.env.MY_SMARTBUCKET;
    const file = await smartbucket.get(filename);

    if (!file) {
      return c.json({ error: 'File not found' }, 404);
    }

    return new Response(file.body, {
      headers: {
        'Content-Type': file.httpMetadata?.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Object-Size': file.size.toString(),
        'X-Object-ETag': file.etag,
        'X-Object-Uploaded': file.uploaded.toISOString(),
      }
    });
  } catch (error) {
    return c.json({
      error: 'Failed to retrieve file',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/

// Example: Search SmartBucket documents
/*
app.post('/api/search', async (c) => {
  try {
    const { query, page = 1, pageSize = 10 } = await c.req.json();

    if (!query) {
      return c.json({ error: 'Query is required' }, 400);
    }

    const smartbucket = c.env.MY_SMARTBUCKET;

    // For initial search
    if (page === 1) {
      const requestId = `search-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const results = await smartbucket.search({
        input: query,
        requestId
      });

      return c.json({
        success: true,
        message: 'Search completed',
        query,
        results: results.results,
        pagination: {
          ...results.pagination,
          requestId
        }
      });
    } else {
      // For paginated results
      const { requestId } = await c.req.json();
      if (!requestId) {
        return c.json({ error: 'Request ID required for pagination' }, 400);
      }

      const paginatedResults = await smartbucket.getPaginatedResults({
        requestId,
        page,
        pageSize
      });

      return c.json({
        success: true,
        message: 'Paginated results',
        query,
        results: paginatedResults.results,
        pagination: paginatedResults.pagination
      });
    }
  } catch (error) {
    return c.json({
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/

// Example: Chunk search for finding specific sections
/*
app.post('/api/chunk-search', async (c) => {
  try {
    const { query } = await c.req.json();

    if (!query) {
      return c.json({ error: 'Query is required' }, 400);
    }

    const smartbucket = c.env.MY_SMARTBUCKET;
    const requestId = `chunk-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const results = await smartbucket.chunkSearch({
      input: query,
      requestId
    });

    return c.json({
      success: true,
      message: 'Chunk search completed',
      query,
      results: results.results
    });
  } catch (error) {
    return c.json({
      error: 'Chunk search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/

// Example: Document chat/Q&A
/*
app.post('/api/document-chat', async (c) => {
  try {
    const { objectId, query } = await c.req.json();

    if (!objectId || !query) {
      return c.json({ error: 'objectId and query are required' }, 400);
    }

    const smartbucket = c.env.MY_SMARTBUCKET;
    const requestId = `chat-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const response = await smartbucket.documentChat({
      objectId,
      input: query,
      requestId
    });

    return c.json({
      success: true,
      message: 'Document chat completed',
      objectId,
      query,
      answer: response.answer
    });
  } catch (error) {
    return c.json({
      error: 'Document chat failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/

// Example: List objects in bucket
/*
app.get('/api/list', async (c) => {
  try {
    const url = new URL(c.req.url);
    const prefix = url.searchParams.get('prefix') || undefined;
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;

    const smartbucket = c.env.MY_SMARTBUCKET;

    const listOptions: BucketListOptions = {
      prefix,
      limit
    };

    const result = await smartbucket.list(listOptions);

    return c.json({
      success: true,
      objects: result.objects.map(obj => ({
        key: obj.key,
        size: obj.size,
        uploaded: obj.uploaded,
        etag: obj.etag
      })),
      truncated: result.truncated,
      cursor: result.truncated ? result.cursor : undefined
    });
  } catch (error) {
    return c.json({
      error: 'List failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/

// === KV Cache Examples ===
// Example: Store data in KV cache
/*
app.post('/api/cache', async (c) => {
  try {
    const { key, value, ttl } = await c.req.json();

    if (!key || value === undefined) {
      return c.json({ error: 'key and value are required' }, 400);
    }

    const cache = c.env.MY_CACHE;

    const putOptions: KvCachePutOptions = {};
    if (ttl) {
      putOptions.expirationTtl = ttl;
    }

    await cache.put(key, JSON.stringify(value), putOptions);

    return c.json({
      success: true,
      message: 'Data cached successfully',
      key
    });
  } catch (error) {
    return c.json({
      error: 'Cache put failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/

// Example: Get data from KV cache
/*
app.get('/api/cache/:key', async (c) => {
  try {
    const key = c.req.param('key');

    const cache = c.env.MY_CACHE;

    const getOptions: KvCacheGetOptions<'json'> = {
      type: 'json'
    };

    const value = await cache.get(key, getOptions);

    if (value === null) {
      return c.json({ error: 'Key not found in cache' }, 404);
    }

    return c.json({
      success: true,
      key,
      value
    });
  } catch (error) {
    return c.json({
      error: 'Cache get failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/

// === Queue Examples ===
// Example: Send message to queue
/*
app.post('/api/queue/send', async (c) => {
  try {
    const { message, delaySeconds } = await c.req.json();

    if (!message) {
      return c.json({ error: 'message is required' }, 400);
    }

    const queue = c.env.MY_QUEUE;

    const sendOptions: QueueSendOptions = {};
    if (delaySeconds) {
      sendOptions.delaySeconds = delaySeconds;
    }

    await queue.send(message, sendOptions);

    return c.json({
      success: true,
      message: 'Message sent to queue'
    });
  } catch (error) {
    return c.json({
      error: 'Queue send failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/

// === Environment Variable Examples ===
app.get('/api/config', (c) => {
  return c.json({
    hasEnv: !!c.env,
    availableBindings: {
      // These would be true if the resources are bound in raindrop.manifest
      // MY_ACTOR: !!c.env.MY_ACTOR,
      // MY_SMARTBUCKET: !!c.env.MY_SMARTBUCKET,
      // MY_CACHE: !!c.env.MY_CACHE,
      // MY_QUEUE: !!c.env.MY_QUEUE,
    },
    // Example access to environment variables:
    // MY_SECRET_VAR: c.env.MY_SECRET_VAR // This would be undefined if not set
  });
});

export default class extends Service<Env> {
  async fetch(request: Request): Promise<Response> {
    return app.fetch(request, this.env);
  }
}
