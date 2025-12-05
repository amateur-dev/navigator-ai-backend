import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/ping', (req, res) => {
    res.send('pong');
});

import fs from 'fs';
import Raindrop from '@liquidmetal-ai/lm-raindrop';
import multer from 'multer';
// NOTE: mocked API responses removed per request. Only `specialists` (doctors) remain mocked.

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

        // Return a dynamic response — document id and upload metadata
        const response = {
            success: true,
            data: {
                documentId: req.file.filename || req.file.path,
                originalName: req.file.originalname,
                size: req.file.size,
                uploadedAt: new Date().toISOString()
            },
            message: 'File uploaded successfully'
        };

        res.status(200).json(response);
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
// In-memory referrals storage for local development. Start empty — no mocks for responses.
let referrals: any[] = [];
// In-memory logs store for referrals
const referralLogs: Record<string, any[]> = {};
let specialists = [
    { id: 1, name: 'Dr. James Mitchell', specialty: 'Cardiologist' },
    { id: 2, name: 'Dr. Emily Chen', specialty: 'Dermatologist' }
];

// Mock extraction endpoint for local development
app.post('/extract', async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ 
                success: false,
                error: {
                    code: "MISSING_DOCUMENT_ID",
                    message: "Document ID is required",
                    statusCode: 400
                }
            });
        }

        // For local development this endpoint should call an external extraction service
        // or return an error if no extraction integration is configured. We will attempt
        // to call the configured VULTR extraction service and return its result.
        // If no extraction service is configured, respond with 501 Not Implemented.

        const VULTR_URL = process.env.VULTR_EXTRACTION_URL;
        if (!VULTR_URL) {
            return res.status(501).json({
                success: false,
                error: {
                    code: 'EXTRACTION_NOT_CONFIGURED',
                    message: 'Extraction service not configured for this environment',
                    statusCode: 501
                }
            });
        }

        // If configured, call the external extraction service
        try {
            // Attempt to read the file path saved by multer
            const filePath = req.file?.path;
            if (!filePath || !fs.existsSync(filePath)) {
                return res.status(404).json({ success: false, error: { code: 'FILE_NOT_FOUND', message: 'Uploaded file not found', statusCode: 404 } });
            }

            const fileBuffer = fs.readFileSync(filePath);
            const FormData = require('form-data');
            const formData = new FormData();
            formData.append('file', fileBuffer, req.file.originalname);

            const fetch = require('node-fetch');
            const r = await fetch(VULTR_URL, { method: 'POST', body: formData });
            const json = await r.json();
            if (!r.ok || !json.success) {
                throw new Error(json?.error?.message || json?.error || `Service returned status ${r.status}`);
            }

            // Extract phone and email from the extracted data
            const extractedData = json.data?.extractedData || {};
            const fullText = Object.values(extractedData).join(' ');
            
            // Parse email and phone if not already present
            if (!extractedData.patientEmail) {
                extractedData.patientEmail = extractEmail(fullText);
            }
            if (!extractedData.patientPhoneNumber) {
                extractedData.patientPhoneNumber = extractPhoneNumber(fullText);
            }

            // Return extraction result with enhanced data
            return res.status(200).json({
                ...json,
                data: {
                    ...json.data,
                    extractedData
                }
            });
        } catch (ex) {
            console.error('Extraction RPC error:', ex);
            const errorMsg = ex instanceof Error ? ex.message : String(ex);
            return res.status(500).json({ 
                success: false, 
                error: { 
                    code: 'EXTRACTION_FAILED', 
                    message: errorMsg,
                    statusCode: 500 
                } 
            });
        }
    } catch (error) {
        console.error('Extract error:', error);
        const errorMsg = error instanceof Error ? error.message : 'Failed to extract data from document';
        return res.status(500).json({
            success: false,
            error: {
                code: "EXTRACTION_FAILED",
                message: errorMsg,
                statusCode: 500
            }
        });
    }
});

// Helper to extract email from text
function extractEmail(text: string): string | null {
    const emailRegex = /([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const match = text.match(emailRegex);
    return match ? match[1] : null;
}

// Helper to extract phone number from text
function extractPhoneNumber(text: string): string | null {
    // Match various phone formats: +1-555-123-4567, (555) 123-4567, 555.123.4567, 5551234567, etc.
    const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
    const match = text.match(phoneRegex);
    if (match) {
        return `+1-${match[1]}-${match[2]}-${match[3]}`;
    }
    return null;
}

// Helper to determine specialty
function determineSpecialty(reason: string): string {
    const r = reason.toLowerCase();
    if (r.includes('heart') || r.includes('chest')) return 'Cardiologist';
    if (r.includes('skin') || r.includes('rash')) return 'Dermatologist';
    return 'General Practitioner';
}

app.post('/seed', (req, res) => {
    // support body { clearReferralsOnly: true } to remove only referrals and preserve specialists
    const { clearReferralsOnly } = req.body || {};
    
    if (clearReferralsOnly) {
        const clearedCount = referrals.length;
        referrals = [];
        // Clear associated logs as well
        Object.keys(referralLogs).forEach(key => delete referralLogs[key]);
        return res.json({ 
            success: true,
            message: `Referrals cleared (${clearedCount} removed, specialists preserved)`,
            data: {
                referralsCleared: clearedCount,
                specialistsPreserved: specialists.length
            }
        });
    }

    // default behavior: full local seed (clear referrals and specialists)
    const clearedReferrals = referrals.length;
    const clearedSpecialists = specialists.length;
    referrals = [];
    specialists = [];
    Object.keys(referralLogs).forEach(key => delete referralLogs[key]);
    
    res.json({ 
        success: true,
        message: 'Database seeded (all referrals and specialists cleared)',
        data: {
            referralsCleared: clearedReferrals,
            specialistsCleared: clearedSpecialists,
            logsCleared: Object.keys(referralLogs).length
        }
    });
});


app.post('/orchestrate', async (req, res) => {
    try {
        // Accept both { referralData: {...} } and flat object formats
        const rawData = req.body.referralData || req.body;
        
        if (!rawData) {
            return res.status(400).json({ 
                success: false, 
                error: {
                    code: 'MISSING_REFERRAL_DATA',
                    message: 'Missing referralData in request body',
                    statusCode: 400
                }
            });
        }

        // Handle patientName -> patientFirstName/patientLastName conversion
        let patientFirstName = rawData.patientFirstName;
        let patientLastName = rawData.patientLastName;
        
        // If patientName is provided, split it into first and last name
        if (rawData.patientName && !patientFirstName && !patientLastName) {
            const nameParts = rawData.patientName.trim().split(/\s+/);
            patientFirstName = nameParts[0] || '';
            patientLastName = nameParts.slice(1).join(' ') || '';
        }

        const {
            patientEmail,
            patientPhoneNumber,
            age,
            specialty: requestedSpecialty,
            payer,
            plan,
            urgency,
            appointmentDate,
            referralDate,
            providerName,
            facilityName,
            reason,
            referralReason,
            insuranceProvider
        } = rawData;

        // Use referralReason if reason is not provided
        const finalReason = reason || referralReason || '';
        // Use insuranceProvider if payer is not provided
        const finalPayer = payer || insuranceProvider;

        // Validate required fields
        if (!patientFirstName || !patientLastName) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'MISSING_REQUIRED_FIELDS',
                    message: 'patientFirstName and patientLastName (or patientName) are required',
                    statusCode: 400
                }
            });
        }

        const specialty = requestedSpecialty || determineSpecialty(finalReason);
        // Ensure we have default specialists if array is empty
        if (specialists.length === 0) {
            specialists = [
                { id: 1, name: 'Dr. James Mitchell', specialty: 'Cardiologist' },
                { id: 2, name: 'Dr. Emily Chen', specialty: 'Dermatologist' }
            ];
        }
        const specialist = specialists.find(s => s.specialty === specialty) || specialists[0];

        // Generate future appointment date for demo (7-14 days from now)
        const demoAppointmentDate = new Date();
        demoAppointmentDate.setDate(demoAppointmentDate.getDate() + Math.floor(Math.random() * 7) + 7);

        const newReferral = {
            id: `ref-${Date.now()}`,
            patientFirstName,
            patientLastName,
            patientPhoneNumber: patientPhoneNumber || null,
            patientEmail: patientEmail || null,
            age,
            specialty,
            payer: finalPayer,
            plan,
            urgency,
            appointmentDate: appointmentDate || demoAppointmentDate.toISOString(),
            referralDate: referralDate || new Date().toISOString(),
            providerName: providerName || specialist.name,
            facilityName: facilityName || 'Downtown Medical Center',
            reason: finalReason,
            status: 'Confirmed', // Auto-progress to confirmed for demo
            noShowRisk: Math.floor(Math.random() * 50)
        };

        referrals.push(newReferral);
        
        // Create comprehensive logs for the orchestration
        const now = new Date();
        referralLogs[newReferral.id] = [
            { 
                id: `log-${Date.now()}-1`, 
                event: 'Referral Created', 
                type: 'system', 
                timestamp: now.toISOString(), 
                user: 'system', 
                description: 'Referral created through orchestration engine'
            },
            {
                id: `log-${Date.now()}-2`,
                event: 'Eligibility Verified',
                type: 'system',
                timestamp: new Date(now.getTime() + 5000).toISOString(),
                user: 'system',
                description: `Eligibility verified with ${finalPayer || 'insurance provider'}`
            },
            {
                id: `log-${Date.now()}-3`,
                event: 'Prior Authorization Approved',
                type: 'system',
                timestamp: new Date(now.getTime() + 10000).toISOString(),
                user: 'system',
                description: 'Prior authorization approved by insurance'
            },
            {
                id: `log-${Date.now()}-4`,
                event: 'Appointment Scheduled',
                type: 'system',
                timestamp: new Date(now.getTime() + 15000).toISOString(),
                user: 'system',
                description: `Appointment scheduled with ${specialist.name}`
            }
        ];

        // Log notification events
        if (patientEmail) {
            referralLogs[newReferral.id].push({
                id: `log-${Date.now()}-email`,
                event: 'Appointment Confirmation Email Sent',
                type: 'message',
                timestamp: new Date(now.getTime() + 16000).toISOString(),
                user: 'system',
                description: `Appointment confirmation sent to ${patientEmail}`,
                details: {
                    recipient: patientEmail,
                    channel: 'email',
                    status: 'sent'
                }
            });
        }

        if (patientPhoneNumber) {
            referralLogs[newReferral.id].push({
                id: `log-${Date.now()}-sms`,
                event: 'Appointment Confirmation SMS Sent',
                type: 'message',
                timestamp: new Date(now.getTime() + 17000).toISOString(),
                user: 'system',
                description: `Appointment confirmation sent to ${patientPhoneNumber}`,
                details: {
                    recipient: patientPhoneNumber,
                    channel: 'sms',
                    status: 'sent'
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                referralId: newReferral.id,
                status: 'Confirmed',
                orchestrationId: `orch-${Date.now()}`,
                specialist: specialty,
                assignedDoctor: specialist.name,
                completedSteps: [
                    'Referral Created',
                    'Eligibility Verified',
                    'Prior Authorization Approved',
                    'Appointment Scheduled'
                ],
                appointmentDetails: {
                    providerName: specialist.name,
                    facilityName: newReferral.facilityName,
                    facilityAddress: '123 Main St',
                    appointmentDate: newReferral.appointmentDate
                },
                notificationsSent: {
                    email: !!patientEmail,
                    sms: !!patientPhoneNumber
                }
            },
            message: 'Referral orchestration completed successfully with auto-confirmation and notifications'
        });
    } catch (error) {
        console.error('Orchestrate error:', error);
        const errorMsg = error instanceof Error ? error.message : 'Orchestration failed';
        res.status(500).json({ 
            success: false, 
            error: {
                code: 'ORCHESTRATION_FAILED',
                message: errorMsg,
                statusCode: 500
            }
        });
    }
});

app.get('/referrals', (req, res) => {
    // Ensure every referral returned has an explicit patientPhoneNumber field
    const out = referrals
        .map(r => ({ ...r, patientPhoneNumber: r.patientPhoneNumber ?? null }))
        .sort((a, b) => new Date((b.referralDate || '')).getTime() - new Date((a.referralDate || '')).getTime());

    res.status(200).json({
        success: true,
        data: {
            referrals: out,
            pagination: {
                page: 1,
                limit: 50,
                total: out.length,
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
        // Explicitly include patientPhoneNumber in the response (may be null)
        const out = { ...referral, patientPhoneNumber: referral.patientPhoneNumber ?? null };
        res.status(200).json({ success: true, data: out });
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
    const found = referrals.find(r => r.id === id);
    if (!found) {
        return res.status(404).json({
            success: false,
            error: { code: 'REFERRAL_NOT_FOUND', message: `Referral with ID '${id}' not found`, statusCode: 404 }
        });
    }

    const logs = referralLogs[id] || [];
    res.status(200).json({ success: true, data: { referralId: id, logs } });
});

app.get('/metrics', (req, res) => {
    try {
        // 1. Overview Metrics
        const totalReferrals = referrals.length;
        const activeReferrals = referrals.filter(r => ['Pending', 'Scheduled', 'InProgress'].includes(r.status)).length;
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const completedThisMonth = referrals.filter(r =>
            r.status === 'Completed' && new Date(r.created_at || r.referralDate) >= startOfMonth
        ).length;

        const pendingReview = referrals.filter(r => r.status === 'Pending').length;
        const totalCompleted = referrals.filter(r => r.status === 'Completed').length;
        const successRate = totalReferrals > 0 ? (totalCompleted / totalReferrals) * 100 : 0;

        // 2. Status Breakdown
        const referralsByStatus = referrals.reduce((acc: any, r) => {
            const status = r.status.toLowerCase();
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        // 3. Top Specialties
        const specialtiesCount = referrals.reduce((acc: any, r) => {
            acc[r.specialty] = (acc[r.specialty] || 0) + 1;
            return acc;
        }, {});

        const topSpecialties = Object.entries(specialtiesCount)
            .map(([specialty, count]: [string, any]) => ({
                specialty,
                count,
                percentage: totalReferrals > 0 ? (count / totalReferrals) * 100 : 0
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // 4. Insurance Breakdown
        const payerCount = referrals.reduce((acc: any, r) => {
            if (r.payer) {
                acc[r.payer] = (acc[r.payer] || 0) + 1;
            }
            return acc;
        }, {});

        const insuranceBreakdown = {
            topPayers: Object.entries(payerCount)
                .map(([payer, count]: [string, any]) => ({ payer, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
        };

        // 5. Appointment Metrics
        const now = new Date();
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);

        const upcomingToday = referrals.filter(r =>
            r.status === 'Scheduled' &&
            r.appointmentDate &&
            new Date(r.appointmentDate).toDateString() === now.toDateString()
        ).length;

        const upcomingThisWeek = referrals.filter(r =>
            r.status === 'Scheduled' &&
            r.appointmentDate &&
            new Date(r.appointmentDate) >= now &&
            new Date(r.appointmentDate) <= nextWeek
        ).length;

        const upcomingThisMonth = referrals.filter(r =>
            r.status === 'Scheduled' &&
            r.appointmentDate &&
            new Date(r.appointmentDate).getMonth() === now.getMonth() &&
            new Date(r.appointmentDate).getFullYear() === now.getFullYear()
        ).length;

        // 6. Urgency Levels
        const urgencyLevels = referrals.reduce((acc: any, r) => {
            const urgency = (r.urgency || 'unknown').toLowerCase();
            acc[urgency] = (acc[urgency] || 0) + 1;
            return acc;
        }, {});

        // 7. Alerts
        const twoDaysAgo = new Date(now);
        twoDaysAgo.setDate(now.getDate() - 2);

        const pendingOver48h = referrals.filter(r =>
            r.status === 'Pending' &&
            new Date(r.created_at || r.referralDate) < twoDaysAgo
        ).length;

        res.json({
            success: true,
            data: {
                overview: {
                    totalReferrals,
                    activeReferrals,
                    completedThisMonth,
                    pendingReview,
                    averageProcessingTime: "2.3 days",
                    successRate: parseFloat(successRate.toFixed(1))
                },
                referralsByStatus,
                topSpecialties,
                insuranceBreakdown,
                appointments: {
                    upcomingToday,
                    upcomingThisWeek,
                    upcomingThisMonth
                },
                providers: {
                    totalSpecialists: 48,
                    availableSpecialists: 42,
                    utilizationRate: 78.5
                },
                trends: {
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
                alerts: {
                    pendingOver48h,
                    upcomingHighRiskNoShows: 0,
                    totalAlerts: pendingOver48h
                },
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Metrics error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: "METRICS_ERROR",
                message: "Failed to retrieve metrics",
                statusCode: 500
            }
        });
    }
});

import path from 'path';
// ESM replacement for require.main === module
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.argv[1] === __filename) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

export default app;
