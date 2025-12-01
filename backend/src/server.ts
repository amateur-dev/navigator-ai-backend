import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/ping', (req, res) => {
    res.send('pong');
});

import multer from 'multer';
import Raindrop from '@liquidmetal-ai/lm-raindrop';
import fs from 'fs';
import {
    MOCK_UPLOAD_RESPONSE,
    MOCK_ORCHESTRATION_RESPONSE,
    MOCK_REFERRALS_LIST,
    MOCK_REFERRAL_DETAILS,
    MOCK_REFERRAL_LOGS
} from './api/mockData.js';

const upload = multer({ dest: 'uploads/' });
const client = new Raindrop({ apiKey: process.env.RAINDROP_API_KEY || 'mock-key' });

app.post('/upload', upload.single('file'), async (req: any, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    try {
        // For local development, we just keep the file in uploads/
        // In production with Raindrop, this would upload to SmartBucket
        console.log(`File uploaded: ${req.file.originalname} (${req.file.size} bytes)`);
        console.log(`Saved to: ${req.file.path}`);

        res.status(200).json(MOCK_UPLOAD_RESPONSE);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: "UPLOAD_FAILED",
                message: "Failed to process document",
                statusCode: 500
            }
        });
    }
});

// In-memory storage for local development
let referrals: any[] = [];
let specialists = [
    { id: 1, name: 'Dr. James Mitchell', specialty: 'Cardiologist' },
    { id: 2, name: 'Dr. Emily Chen', specialty: 'Dermatologist' }
];

// Helper to determine specialty
function determineSpecialty(reason: string): string {
    const r = reason.toLowerCase();
    if (r.includes('heart') || r.includes('chest')) return 'Cardiologist';
    if (r.includes('skin') || r.includes('rash')) return 'Dermatologist';
    return 'General Practitioner';
}

app.post('/seed', (req, res) => {
    referrals = [];
    res.json({ message: 'Database seeded (cleared)' });
});

app.post('/orchestrate', async (req, res) => {
    try {
        const { referralData } = req.body;

        if (!referralData) {
            return res.status(400).json({ success: false, error: 'Missing referralData' });
        }

        const {
            patientFirstName,
            patientLastName,
            patientEmail,
            age,
            specialty: requestedSpecialty,
            payer,
            plan,
            urgency,
            appointmentDate,
            referralDate,
            providerName,
            facilityName,
            reason
        } = referralData;

        const specialty = requestedSpecialty || determineSpecialty(reason || '');
        const specialist = specialists.find(s => s.specialty === specialty) || specialists[0];

        const newReferral = {
            id: `ref-${Date.now()}`,
            patientFirstName,
            patientLastName,
            patientEmail,
            age,
            specialty,
            payer,
            plan,
            urgency,
            appointmentDate,
            referralDate: referralDate || new Date().toISOString(),
            providerName,
            facilityName,
            reason,
            status: 'Pending',
            noShowRisk: Math.floor(Math.random() * 50)
        };

        referrals.push(newReferral);

        res.status(200).json({
            success: true,
            data: {
                referralId: newReferral.id,
                status: 'Processed',
                orchestrationId: `orch-${Date.now()}`,
                completedSteps: [],
                appointmentDetails: {
                    providerName: specialist.name,
                    facilityName: 'Downtown Medical Center',
                    facilityAddress: '123 Main St'
                }
            },
            message: 'Referral orchestration completed successfully'
        });
    } catch (error) {
        console.error('Orchestrate error:', error);
        res.status(500).json({ success: false, error: 'Orchestration failed' });
    }
});

app.get('/referrals', (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            referrals: referrals.sort((a, b) => new Date(b.referralDate).getTime() - new Date(a.referralDate).getTime()),
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
});

app.get('/referral/:id', (req, res) => {
    const { id } = req.params;
    const referral = referrals.find(r => r.id === id);

    if (referral) {
        res.status(200).json({ success: true, data: referral });
    } else {
        res.status(404).json({
            success: false,
            error: {
                code: "REFERRAL_NOT_FOUND",
                message: `Referral with ID '${id}' not found`,
                statusCode: 404
            }
        });
    }
});

app.get('/referral/:id/logs', (req, res) => {
    const { id } = req.params;
    // Return mock logs for now
    res.status(200).json(MOCK_REFERRAL_LOGS);
});

// ESM replacement for require.main === module
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.argv[1] === __filename) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

export default app;
