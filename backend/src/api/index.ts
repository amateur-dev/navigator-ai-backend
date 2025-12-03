import { Service } from '@liquidmetal-ai/raindrop-framework';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { QueueSendOptions } from '@liquidmetal-ai/raindrop-framework';
import { KvCachePutOptions, KvCacheGetOptions } from '@liquidmetal-ai/raindrop-framework';
import { BucketPutOptions, BucketListOptions } from '@liquidmetal-ai/raindrop-framework';
import { Env } from './raindrop.gen';
// NOTE: API responses should not be static mocks. The mock data file remains for tests, but
// production/dev endpoints should produce live/dynamic responses. Only 'specialists' remain mocked.

// Exported for testing/mocking
export function determineSpecialty(referralReason: string): string {
  let specialty = 'General Practitioner';
  const reasonLower = referralReason.toLowerCase();

  const specialtyMap: Record<string, string[]> = {
    'Cardiologist': ['heart', 'cardio', 'chest', 'palpitation', 'pulse', 'pressure'],
    'Dermatologist': ['skin', 'derma', 'rash', 'itch', 'acne', 'mole', 'lesion', 'nevus'],
    'Orthopedist': ['bone', 'joint', 'knee', 'back', 'spine', 'fracture', 'ortho', 'shoulder', 'hip'],
    'Neurologist': ['headache', 'migraine', 'seizure', 'numbness', 'dizzy', 'brain', 'nerve', 'neuro'],
    'Pediatrician': ['child', 'baby', 'infant', 'toddler', 'pediatric', 'growth', 'allergy'],
    'Psychiatrist': ['mental', 'depress', 'anxiety', 'mood', 'psych', 'behavior'],
    'Oncologist': ['cancer', 'tumor', 'lump', 'onco', 'chemo', 'radiation', 'mammogram', 'breast', 'bi-rads'],
    'Gastroenterologist': ['stomach', 'gut', 'digest', 'bowel', 'reflux', 'gastro', 'liver', 'anemia'],
    'Pulmonologist': ['lung', 'breath', 'cough', 'pulmo', 'respiratory', 'asthma'],
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
  return specialty;
}

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

    // Generate unique document ID
    const documentId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    await smartbucket.put(documentId, new Uint8Array(arrayBuffer), {
      httpMetadata: {
        contentType: file.type || 'application/pdf',
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });

    // Return document ID for subsequent API calls
    return c.json({
      success: true,
      message: 'File uploaded successfully',
      id: documentId,
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
// PDF Extraction endpoint using SmartBucket AI with retry logic
app.post('/extract', async (c) => {
  try {
    const body = await c.req.json();
    const { id } = body;

    if (!id) {
      return c.json({ error: 'Document ID is required' }, 400);
    }

    // Get the PDF from SmartBucket
    const smartbucket = c.env.REFERRAL_DOCS;
    const pdfObject = await smartbucket.get(id);

    if (!pdfObject) {
      return c.json({ error: 'Document not found' }, 404);
    }

    // Call Vultr Extraction Service
    // Using nip.io to avoid Cloudflare "Direct IP Access" error (1003)
    const VULTR_URL = 'http://139.180.220.93.nip.io:3001/extract';
    console.log(`Calling Vultr Extraction Service at ${VULTR_URL}...`);

    const arrayBuffer = await pdfObject.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', blob, 'referral.pdf');

    let extractedData;
    try {
      const vultrResponse = await fetch(VULTR_URL, {
        method: 'POST',
        headers: {
          'User-Agent': 'Navigator-Backend/1.0',
          'Accept': 'application/json'
        },
        body: formData
      });

      if (!vultrResponse.ok) {
        const errorText = await vultrResponse.text();
        throw new Error(`Vultr service returned ${vultrResponse.status} ${vultrResponse.statusText}: ${errorText}`);
      }

      const vultrResult = await vultrResponse.json();
      if (!vultrResult.success) {
        throw new Error(vultrResult.error || 'Unknown error from Vultr');
      }
      
      extractedData = vultrResult.data;
      console.log('Vultr Extraction Result:', extractedData);

    } catch (vultrError) {
      console.error('Vultr Extraction Failed:', vultrError);
      return c.json({
        success: false,
        error: {
          code: "EXTRACTION_FAILED",
          message: "Failed to extract data via Vultr: " + (vultrError instanceof Error ? vultrError.message : String(vultrError)),
          statusCode: 500
        }
      }, 500);
    }

    // Return standardized response format matching /upload endpoint pattern
    return c.json({
      success: true,
      data: {
        extractedData: {
          patientFirstName: extractedData.patientName?.split(' ')[0] || 'Unknown',
          patientLastName: extractedData.patientName?.split(' ').slice(1).join(' ') || 'Unknown',
          patientEmail: extractedData.patientEmail || null,
          patientPhoneNumber: extractedData.patientPhoneNumber || null,
          age: extractedData.dateOfBirth ? calculateAge(extractedData.dateOfBirth) : null,
          specialty: determineSpecialty(extractedData.referralReason || ''),
          payer: extractedData.insuranceProvider || 'Unknown',
          plan: extractedData.plan || 'Unknown',
          urgency: extractedData.urgency || 'routine',
          appointmentDate: null,
          referralDate: new Date().toISOString(),
          providerName: extractedData.providerName || 'Unknown',
          facilityName: 'Unknown',
          reason: extractedData.referralReason || 'Unknown'
        },
        confidence: 1.0,
        documentId: id,
        needsReview: false,
        warnings: []
      },
      message: "Document processed successfully"
    });

  } catch (error) {
    console.error('Extract error:', error);
    return c.json({
      success: false,
      error: {
        code: "EXTRACTION_FAILED",
        message: "Failed to extract data: " + (error instanceof Error ? error.message : String(error)),
        statusCode: 500
      }
    }, 500);
  }
});

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: string): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

// Workflow Orchestration endpoint
app.post('/orchestrate', async (c) => {
  try {
    const body = await c.req.json();
    const { patientName, patientEmail, patientPhoneNumber, referralReason, insuranceProvider } = body;

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
    const specialty = determineSpecialty(referralReason);

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

    // 4. Create Referral Record in DB (now with email and phone)
    const sanitizedEmail = patientEmail ? `'${patientEmail.replace(/'/g, "''")}'` : 'NULL';
    const sanitizedPhone = patientPhoneNumber ? `'${patientPhoneNumber.replace(/'/g, "''")}'` : 'NULL';
    const insertQuery = `INSERT INTO referrals (patient_name, patient_email, patient_phone, condition, insurance_provider, specialist_id, status) 
       VALUES ('${patientName.replace(/'/g, "''")}', ${sanitizedEmail}, ${sanitizedPhone}, '${referralReason.replace(/'/g, "''")}', '${insuranceProvider || ''}', ${selectedSpecialist ? selectedSpecialist.id : 'NULL'}, 'Pending')`;

    try {
      const insertResult = await db.executeQuery({ sqlQuery: insertQuery });
      console.log('Insert result:', insertResult);
    } catch (insertError) {
      console.error('INSERT error:', insertError, 'Query was:', insertQuery);
    }

    // SQLite specific: Get last ID
    const idResult = await db.executeQuery({ sqlQuery: 'SELECT last_insert_rowid() as id' });
    const idRows = getRows(idResult);
    console.log('ID result rows:', idRows);
    const referralId = idRows[0]?.id || 'unknown';
    console.log('Referral ID extracted:', referralId);

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
    // allow calling with { clearReferralsOnly: true } to delete only referrals (keep specialists)
    let body = null;
    try {
      body = await c.req.json();
    } catch (e) {
      // no body sent
    }

    if (body && body.clearReferralsOnly) {
      // Only delete referrals (patient data) — do NOT remove specialists
      await db.executeQuery({ sqlQuery: 'DELETE FROM referrals' });
      return c.json({ message: 'Referrals cleared (specialists preserved)' });
    }

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
          patient_email TEXT,
          patient_phone TEXT,
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
app.get('/referrals', async (c) => {
  try {
    const db = c.env.REFERRALS_DB as any;
    
    // Execute query
    const result = await db.executeQuery({ 
      sqlQuery: 'SELECT * FROM referrals ORDER BY created_at DESC' 
    });

    // Helper to extract rows
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

    const rows = getRows(result);

    // Map to API format
    const referrals = rows.map((row: any) => ({
      id: `ref-${row.id}`,
      patientFirstName: row.patient_name ? row.patient_name.split(' ')[0] : 'Unknown',
      patientLastName: row.patient_name ? row.patient_name.split(' ').slice(1).join(' ') : '',
      patientPhoneNumber: row.patient_phone || null,
      patientEmail: row.patient_email || null,
      specialty: 'Unknown',
      payer: row.insurance_provider || 'Unknown',
      status: row.status || 'Pending',
      appointmentDate: null,
      referralDate: row.created_at,
      noShowRisk: 0
    }));

    return c.json({
      success: true,
      data: {
        referrals: referrals,
        pagination: {
          page: 1,
          limit: 50,
          total: referrals.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false
        }
      },
      message: 'Referrals retrieved successfully'
    });
  } catch (error) {
    console.error('Fetch referrals error:', error);
    return c.json({
      success: false,
      error: {
        code: "FETCH_FAILED",
        message: "Failed to fetch referrals",
        statusCode: 500
      }
    }, 500);
  }
});

// Get referral details
app.get('/referral/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const db = c.env.REFERRALS_DB as any;
    // Extract numeric ID from "ref-123"
    const numericId = id.replace('ref-', '');
    
    const result = await db.executeQuery({ 
      sqlQuery: `SELECT * FROM referrals WHERE id = ${numericId}` 
    });

    const getRows = (result: any) => {
      if (Array.isArray(result)) return result;
      if (result && result.results) {
        if (Array.isArray(result.results)) return result.results;
        if (typeof result.results === 'string') {
          try { return JSON.parse(result.results); } catch (e) { return []; }
        }
      }
      if (result && Array.isArray(result.rows)) return result.rows;
      return [];
    };

    const rows = getRows(result);

    if (rows.length > 0) {
      const row = rows[0];
      return c.json({
        success: true,
        data: {
          id: `ref-${row.id}`,
          patientFirstName: row.patient_name ? row.patient_name.split(' ')[0] : 'Unknown',
          patientLastName: row.patient_name ? row.patient_name.split(' ').slice(1).join(' ') : '',
          patientPhoneNumber: row.patient_phone || null,
          patientEmail: row.patient_email || null,
          specialty: 'Unknown',
          payer: row.insurance_provider || 'Unknown',
          status: row.status || 'Pending',
          appointmentDate: null,
          referralDate: row.created_at,
          noShowRisk: 0,
          reason: row.condition
        }
      });
    }

    return c.json({
      success: false,
      error: {
        code: "REFERRAL_NOT_FOUND",
        message: `Referral with ID '${id}' not found`,
        statusCode: 404
      }
    }, 404);

  } catch (error) {
    console.error('Fetch referral error:', error);
    return c.json({
      success: false,
      error: {
        code: "FETCH_FAILED",
        message: "Failed to fetch referral details",
        statusCode: 500
      }
    }, 500);
  }
});

// Get referral logs
app.get('/referral/:id/logs', (c) => {
  // For now, return empty logs or implement DB logs table
  return c.json({
    success: true,
    data: {
      referralId: c.req.param('id'),
      logs: []
    }
  });
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

// Metrics Endpoint
app.get('/metrics', async (c) => {
  try {
    const db = c.env.REFERRALS_DB as any;

    // Helper to extract rows
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

    // 1. Overview Metrics
    const overviewQuery = `
      SELECT 
        COUNT(*) as totalReferrals,
        SUM(CASE WHEN status IN ('Pending', 'Scheduled', 'InProgress') THEN 1 ELSE 0 END) as activeReferrals,
        SUM(CASE WHEN status = 'Completed' AND created_at >= date('now', 'start of month') THEN 1 ELSE 0 END) as completedThisMonth,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pendingReview,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as totalCompleted
      FROM referrals
    `;
    const overviewResult = await db.executeQuery({ sqlQuery: overviewQuery });
    const overviewRows = getRows(overviewResult);
    const overviewData = overviewRows[0] || {};

    const successRate = overviewData.totalReferrals > 0
      ? (overviewData.totalCompleted / overviewData.totalReferrals) * 100
      : 0;

    // 2. Status Breakdown
    const statusQuery = `SELECT status, COUNT(*) as count FROM referrals GROUP BY status`;
    const statusResult = await db.executeQuery({ sqlQuery: statusQuery });
    const statusRows = getRows(statusResult);
    const referralsByStatus = statusRows.reduce((acc: any, row: any) => {
      acc[row.status.toLowerCase()] = row.count;
      return acc;
    }, {});

    // 3. Top Specialties
    const specialtyQuery = `
      SELECT specialty, COUNT(*) as count 
      FROM referrals 
      GROUP BY specialty 
      ORDER BY count DESC 
      LIMIT 5
    `;
    const specialtyResult = await db.executeQuery({ sqlQuery: specialtyQuery });
    const specialtyRows = getRows(specialtyResult);
    const topSpecialties = specialtyRows.map((row: any) => ({
      specialty: row.specialty,
      count: row.count,
      percentage: overviewData.totalReferrals > 0 ? (row.count / overviewData.totalReferrals) * 100 : 0
    }));

    // 4. Insurance Breakdown
    const payerQuery = `
      SELECT payer, COUNT(*) as count 
      FROM referrals 
      WHERE payer IS NOT NULL AND payer != ''
      GROUP BY payer 
      ORDER BY count DESC 
      LIMIT 5
    `;
    const payerResult = await db.executeQuery({ sqlQuery: payerQuery });
    const payerRows = getRows(payerResult);
    const insuranceBreakdown = {
      topPayers: payerRows.map((row: any) => ({
        payer: row.payer,
        count: row.count
      }))
    };

    // 5. Appointment Metrics
    const apptQuery = `
      SELECT 
        SUM(CASE WHEN status = 'Scheduled' AND date(appointment_date) = date('now') THEN 1 ELSE 0 END) as upcomingToday,
        SUM(CASE WHEN status = 'Scheduled' AND date(appointment_date) BETWEEN date('now') AND date('now', '+7 days') THEN 1 ELSE 0 END) as upcomingThisWeek,
        SUM(CASE WHEN status = 'Scheduled' AND strftime('%Y-%m', appointment_date) = strftime('%Y-%m', 'now') THEN 1 ELSE 0 END) as upcomingThisMonth
      FROM referrals
    `;
    const apptResult = await db.executeQuery({ sqlQuery: apptQuery });
    const apptRows = getRows(apptResult);
    const appointments = apptRows[0] || {};

    // 6. Urgency Levels
    const urgencyQuery = `SELECT urgency, COUNT(*) as count FROM referrals GROUP BY urgency`;
    const urgencyResult = await db.executeQuery({ sqlQuery: urgencyQuery });
    const urgencyRows = getRows(urgencyResult);
    const urgencyLevels = urgencyRows.reduce((acc: any, row: any) => {
      acc[row.urgency ? row.urgency.toLowerCase() : 'unknown'] = row.count;
      return acc;
    }, {});

    // 7. Alerts (Mock/Calculated)
    const alerts = {
      pendingOver48h: 0, // Would need date calc in SQL
      upcomingHighRiskNoShows: 0,
      totalAlerts: 0
    };

    // Simple check for pending > 48h
    const pendingOldQuery = `SELECT COUNT(*) as count FROM referrals WHERE status = 'Pending' AND created_at < date('now', '-2 days')`;
    const pendingOldResult = await db.executeQuery({ sqlQuery: pendingOldQuery });
    alerts.pendingOver48h = getRows(pendingOldResult)[0]?.count || 0;
    alerts.totalAlerts = alerts.pendingOver48h;

    return c.json({
      success: true,
      data: {
        overview: {
          totalReferrals: overviewData.totalReferrals,
          activeReferrals: overviewData.activeReferrals,
          completedThisMonth: overviewData.completedThisMonth,
          pendingReview: overviewData.pendingReview,
          averageProcessingTime: "2.3 days", // Mock for now
          successRate: parseFloat(successRate.toFixed(1))
        },
        referralsByStatus,
        topSpecialties,
        insuranceBreakdown,
        appointments,
        providers: {
          totalSpecialists: 48, // Mock
          availableSpecialists: 42, // Mock
          utilizationRate: 78.5 // Mock
        },
        trends: {
          // Mock trends for chart
          dailyReferrals: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 10) + 5
          }))
        },
        urgencyLevels,
        efficiency: {
          averageExtractionTime: "3.2 seconds",
          averageOrchestrationTime: "1.8 seconds"
        },
        alerts,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Metrics error:', error);
    return c.json({
      success: false,
      error: {
        code: "METRICS_ERROR",
        message: "Failed to retrieve metrics: " + (error instanceof Error ? error.message : String(error)),
        statusCode: 500
      }
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
