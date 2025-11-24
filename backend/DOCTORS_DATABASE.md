# Doctors Database

This document lists all 30 specialists seeded into the Navigator-AI backend database.

## Database Overview

- **Total Doctors**: 30
- **Specialties**: 15
- **Doctors per Specialty**: 2

## Specialty Matching Keywords

Each specialty is matched using the following keywords in patient referral reasons:

| Specialty | Keywords |
|-----------|----------|
| Cardiologist | heart, cardio, chest, palpitation, pulse, pressure |
| Dermatologist | skin, derma, rash, itch, acne, mole, lesion |
| Orthopedist | bone, joint, knee, back, spine, fracture, ortho, shoulder, hip |
| Neurologist | headache, migraine, seizure, numbness, dizzy, brain, nerve, neuro |
| Pediatrician | child, baby, infant, toddler, pediatric, growth |
| Psychiatrist | mental, depress, anxiety, mood, psych, behavior |
| Oncologist | cancer, tumor, lump, onco, chemo, radiation |
| Gastroenterologist | stomach, gut, digest, bowel, reflux, gastro, liver |
| Pulmonologist | lung, breath, asthma, cough, pulmo, respiratory |
| Urologist | urine, bladder, kidney, prostate, uro |
| Ophthalmologist | eye, vision, sight, blind, optic |
| ENT Specialist | ear, nose, throat, sinus, hearing |
| Endocrinologist | diabetes, thyroid, hormone, sugar, endo |
| Rheumatologist | arthritis, autoimmune, lupus, rheum |
| General Practitioner | (default for unmatched conditions) |

## Doctors List (Sample Seeding)

### Cardiology (2 doctors)
- Dr. James Mitchell - james.mitchell@hospital.com
- Dr. Sarah Rodriguez - sarah.rodriguez@hospital.com

### Dermatology (2 doctors)
- Dr. Emily Chen - emily.chen@hospital.com
- Dr. Michael Smith - michael.smith@hospital.com

### Orthopedics (2 doctors)
- Dr. David Johnson - david.johnson@hospital.com
- Dr. Jessica Williams - jessica.williams@hospital.com

### Neurology (2 doctors)
- Dr. Jennifer Brown - jennifer.brown@hospital.com
- Dr. Robert Jones - robert.jones@hospital.com

### Pediatrics (2 doctors)
- Dr. William Garcia - william.garcia@hospital.com
- Dr. Elizabeth Miller - elizabeth.miller@hospital.com

### Psychiatry (2 doctors)
- Dr. John Davis - john.davis@hospital.com
- Dr. Linda Rodriguez - linda.rodriguez@hospital.com

### Oncology (2 doctors)
- Dr. Richard Martinez - richard.martinez@hospital.com
- Dr. Barbara Hernandez - barbara.hernandez@hospital.com

### Gastroenterology (2 doctors)
- Dr. Thomas Lopez - thomas.lopez@hospital.com
- Dr. James Lee - james.lee@hospital.com

### Pulmonology (2 doctors)
- Dr. Sarah Chen - sarah.chen@hospital.com
- Dr. Emily Smith - emily.smith@hospital.com

### Urology (2 doctors)
- Dr. Michael Johnson - michael.johnson@hospital.com
- Dr. David Williams - david.williams@hospital.com

### Ophthalmology (2 doctors)
- Dr. Jessica Brown - jessica.brown@hospital.com
- Dr. Jennifer Jones - jennifer.jones@hospital.com

### ENT (Ear, Nose, Throat) (2 doctors)
- Dr. Robert Garcia - robert.garcia@hospital.com
- Dr. William Miller - william.miller@hospital.com

### Endocrinology (2 doctors)
- Dr. Elizabeth Davis - elizabeth.davis@hospital.com
- Dr. John Martinez - john.martinez@hospital.com

### Rheumatology (2 doctors)
- Dr. Linda Hernandez - linda.hernandez@hospital.com
- Dr. Richard Lopez - richard.lopez@hospital.com

### General Practice (2 doctors)
- Dr. Barbara Mitchell - barbara.mitchell@hospital.com
- Dr. Thomas Lee - thomas.lee@hospital.com

---

## How Doctor Assignment Works

1. **Patient uploads PDF** → SmartBucket stores document
2. **AI extracts condition** → e.g., "chest pain and irregular heartbeat"
3. **Keyword matching** → System finds "chest" and "heart" → Routes to **Cardiologist**
4. **Database query** → Finds available Cardiologists
5. **Assignment** → Patient gets one of the 2 Cardiologists

## Appointment Slots

- Each doctor has **0-3 random appointment slots** over the next 7 days
- Slots are randomly assigned during seeding (50% of doctors get slots)
- Appointment times: Random hours between 9 AM - 5 PM

## Seeding the Database

To populate the database with these doctors, call:

```bash
curl -X POST https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run/seed
```

Or run the test script:

```bash
node test-raindrop-seed.mjs
```

---

**Note**: Doctor names are randomly generated from a pool of first and last names during each seeding. The actual names in your database may differ from this sample list.
