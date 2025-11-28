import express from 'express';

// Copied from src/api/index.ts to ensure consistency without build steps
function determineSpecialty(referralReason) {
  let specialty = 'General Practitioner';
  const reasonLower = referralReason.toLowerCase();

  const specialtyMap = {
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

const app = express();
app.use(express.json());

app.post('/orchestrate', (req, res) => {
  const { patientName, referralReason, insuranceProvider } = req.body;

  if (!patientName || !referralReason) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Missing required fields',
        statusCode: 400
      }
    });
  }

  const specialty = determineSpecialty(referralReason);
  const assignedDoctor = `Dr. ${specialty.split(' ')[0] || 'Smith'}`;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const availableSlots = [tomorrow.toISOString()];

  return res.json({
    success: true,
    data: {
      referralId: `ref-${Date.now()}`,
      status: 'Processed',
      specialist: specialty,
      assignedDoctor,
      insuranceStatus: (insuranceProvider?.toLowerCase().includes('blue') ? 'Approved' : 'Pending Review'),
      availableSlots,
      debug: {
        specialtyUsed: specialty,
        specialistsFound: 1,
        slotsFound: availableSlots.length
      }
    },
    message: 'Mock orchestration successful'
  });
});

app.post('/confirm', (req, res) => {
  const {
    patientName,
    doctorName,
    specialty,
    appointmentDate,
    appointmentTime
  } = req.body;

  if (!patientName || !doctorName) {
    return res.status(400).json({ success: false, message: 'patientName and doctorName required' });
  }

  return res.json({
    success: true,
    confirmationSent: true,
    notifications: {
      sms: {
        message: `Confirmation SMS for ${patientName}`,
        length: 130
      },
      email: {
        subject: `Appointment with ${doctorName}`,
        body: `Confirmed ${appointmentDate} ${appointmentTime}`
      }
    },
    appointmentDetails: {
      patient: patientName,
      doctor: doctorName,
      specialty: specialty || 'General Practice'
    }
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Local mock Raindrop running on http://localhost:${PORT}`);
});
