-- Schema for Referrals DB

CREATE TABLE IF NOT EXISTS specialists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    email VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS slots (
    id SERIAL PRIMARY KEY,
    specialist_id INTEGER REFERENCES specialists(id),
    start_time TIMESTAMP NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    patient_email VARCHAR(255),
    patient_phone VARCHAR(20),
    dob DATE,
    condition TEXT,
    insurance_provider VARCHAR(100),
    specialist_id INTEGER REFERENCES specialists(id),
    slot_id INTEGER REFERENCES slots(id),
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Scheduled, Completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
