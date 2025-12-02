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

describe('POST /orchestrate', () => {
    it('should return orchestration results for valid input', async () => {
        const referralData = {
            patientFirstName: 'John',
            patientLastName: 'Doe',
            reason: 'Chest pain'
        };

        const res = await request(app)
            .post('/orchestrate')
            .send({ referralData });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('referralId');
        expect(res.body.data.status).toBe('Processed');
        expect(res.body.data.appointmentDetails).toBeDefined();
    });

    it('should return 400 if referralData is missing', async () => {
        const res = await request(app)
            .post('/orchestrate')
            .send({});
        
        expect(res.status).toBe(400);
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
