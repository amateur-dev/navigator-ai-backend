import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from './server';

// Mock Raindrop SDK
vi.mock('@liquidmetal-ai/lm-raindrop', () => {
    return {
        default: class {
            object = {
                upload: vi.fn().mockResolvedValue({ bucket: 'referral-docs' }),
            };
        }
    };
});

describe('GET /ping', () => {
    it('should return pong', async () => {
        const res = await request(app).get('/ping');
        expect(res.status).toBe(200);
        expect(res.text).toBe('pong');
    });
});

describe('POST /upload', () => {
    it('should upload a file and return dynamic upload response', async () => {
        const res = await request(app)
            .post('/upload')
            .attach('file', Buffer.from('test content'), 'test.pdf');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('documentId');
        expect(res.body.data.originalName).toBe('test.pdf');
    });

    it('should return 400 if no file uploaded', async () => {
        const res = await request(app).post('/upload');
        expect(res.status).toBe(400);
    });
});

describe('POST /extract', () => {
    it('should return 400 if document ID is missing', async () => {
        const res = await request(app)
            .post('/extract')
            .send({});
        
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('MISSING_DOCUMENT_ID');
        expect(res.body.error.message).toBeDefined();
    });

    it('should return 501 if extraction service not configured', async () => {
        const res = await request(app)
            .post('/extract')
            .send({ id: 'test-doc-id' });
        
        expect(res.status).toBe(501);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('EXTRACTION_NOT_CONFIGURED');
        expect(res.body.error.message).toBeDefined();
    });
});

describe('POST /orchestrate', () => {
    beforeEach(async () => {
        // Clear referrals before each test
        await request(app).post('/seed').send({ clearReferralsOnly: true });
    });

    it('should return orchestration results for valid input', async () => {
        const referralData = {
            patientFirstName: 'John',
            patientLastName: 'Doe',
            reason: 'Chest pain',
            patientEmail: 'john@example.com',
            patientPhoneNumber: '+1-555-123-4567'
        };

        const res = await request(app)
            .post('/orchestrate')
            .send({ referralData });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('referralId');
        expect(res.body.data.status).toBe('Confirmed'); // Should be auto-confirmed for demo
        expect(res.body.data.completedSteps).toContain('Referral Created');
        expect(res.body.data.completedSteps).toContain('Eligibility Verified');
        expect(res.body.data.notificationsSent.email).toBe(true);
        expect(res.body.data.notificationsSent.sms).toBe(true);
    });

    it('should return 400 if referralData is missing', async () => {
        const res = await request(app)
            .post('/orchestrate')
            .send({});
        
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('MISSING_REFERRAL_DATA');
    });

    it('should return 400 if required patient fields are missing', async () => {
        const res = await request(app)
            .post('/orchestrate')
            .send({ referralData: { patientFirstName: 'John' } });
        
        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('MISSING_REQUIRED_FIELDS');
    });

    it('should create referral logs with notification events', async () => {
        const referralData = {
            patientFirstName: 'Jane',
            patientLastName: 'Smith',
            reason: 'Skin rash',
            patientEmail: 'jane@example.com',
            patientPhoneNumber: '+1-555-987-6543'
        };

        const orchestRes = await request(app)
            .post('/orchestrate')
            .send({ referralData });

        const referralId = orchestRes.body.data.referralId;

        // Fetch logs to verify
        const logsRes = await request(app).get(`/referral/${referralId}/logs`);
        expect(logsRes.status).toBe(200);
        expect(logsRes.body.data.logs.length).toBeGreaterThanOrEqual(6); // At least 4 steps + 2 notifications

        // Verify notification logs
        const emailLog = logsRes.body.data.logs.find((l: any) => l.event === 'Appointment Confirmation Email Sent');
        const smsLog = logsRes.body.data.logs.find((l: any) => l.event === 'Appointment Confirmation SMS Sent');
        
        expect(emailLog).toBeDefined();
        expect(smsLog).toBeDefined();
        expect(emailLog.details.recipient).toBe('jane@example.com');
        expect(smsLog.details.recipient).toBe('+1-555-987-6543');
    });

    it('should handle missing phone/email gracefully', async () => {
        const referralData = {
            patientFirstName: 'Bob',
            patientLastName: 'Johnson',
            reason: 'Checkup'
        };

        const res = await request(app)
            .post('/orchestrate')
            .send({ referralData });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.notificationsSent.email).toBe(false);
        expect(res.body.data.notificationsSent.sms).toBe(false);
    });
});

describe('GET /referrals', () => {
    beforeEach(async () => {
        // Clear referrals before test
        await request(app).post('/seed').send({ clearReferralsOnly: true });
    });

    it('should return empty list initially', async () => {
        const res = await request(app).get('/referrals');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.referrals).toEqual([]);
        expect(res.body.data.pagination.total).toBe(0);
    });

    it('should return created referrals', async () => {
        // Create a referral first
        const referralData = {
            patientFirstName: 'Jane',
            patientLastName: 'Smith',
            reason: 'Skin rash'
        };
        await request(app).post('/orchestrate').send({ referralData });

        const res = await request(app).get('/referrals');
        expect(res.status).toBe(200);
        expect(res.body.data.referrals).toHaveLength(1);
        expect(res.body.data.referrals[0].patientFirstName).toBe('Jane');
        expect(res.body.data.referrals[0]).toHaveProperty('patientPhoneNumber'); // Ensure field exists
    });
});

describe('GET /referral/:id', () => {
    let createdId: string;

    beforeEach(async () => {
        await request(app).post('/seed').send({ clearReferralsOnly: true });
        const res = await request(app).post('/orchestrate').send({
            referralData: {
                patientFirstName: 'Test',
                patientLastName: 'User',
                reason: 'Checkup'
            }
        });
        createdId = res.body.data.referralId;
    });

    it('should return referral details for valid ID', async () => {
        const res = await request(app).get(`/referral/${createdId}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(createdId);
        expect(res.body.data).toHaveProperty('patientPhoneNumber');
    });

    it('should return 404 for invalid ID', async () => {
        const res = await request(app).get('/referral/invalid-id');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('REFERRAL_NOT_FOUND');
    });
});

describe('GET /referral/:id/logs', () => {
    let createdId: string;

    beforeEach(async () => {
        await request(app).post('/seed').send({ clearReferralsOnly: true });
        const res = await request(app).post('/orchestrate').send({
            referralData: {
                patientFirstName: 'Log',
                patientLastName: 'Test',
                reason: 'Logging'
            }
        });
        createdId = res.body.data.referralId;
    });

    it('should return referral logs for valid ID', async () => {
        const res = await request(app).get(`/referral/${createdId}/logs`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.referralId).toBe(createdId);
        expect(Array.isArray(res.body.data.logs)).toBe(true);
        expect(res.body.data.logs.length).toBeGreaterThan(0); // Should have creation log
    });

    it('should return 404 for invalid ID', async () => {
        const res = await request(app).get('/referral/invalid-id/logs');
        expect(res.status).toBe(404);
    });
});

describe('POST /seed', () => {
    it('should clear only referrals when clearReferralsOnly is true', async () => {
        // Create a referral first
        await request(app).post('/orchestrate').send({
            referralData: {
                patientFirstName: 'Test',
                patientLastName: 'User',
                reason: 'Checkup'
            }
        });

        const res = await request(app).post('/seed').send({ clearReferralsOnly: true });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.referralsCleared).toBeGreaterThan(0);

        // Verify referrals are cleared
        const referralsRes = await request(app).get('/referrals');
        expect(referralsRes.body.data.referrals).toHaveLength(0);
    });

    it('should clear all data when clearReferralsOnly is false or omitted', async () => {
        // Create a referral
        await request(app).post('/orchestrate').send({
            referralData: {
                patientFirstName: 'Test',
                patientLastName: 'User',
                reason: 'Checkup'
            }
        });

        const res = await request(app).post('/seed').send({});
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.referralsCleared).toBeGreaterThan(0);

        // Verify referrals are cleared
        const referralsRes = await request(app).get('/referrals');
        expect(referralsRes.body.data.referrals).toHaveLength(0);
    });
});
