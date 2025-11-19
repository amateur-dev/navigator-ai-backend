import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from './server';
import {
    MOCK_UPLOAD_RESPONSE,
    MOCK_ORCHESTRATION_RESPONSE,
    MOCK_REFERRALS_LIST,
    MOCK_REFERRAL_DETAILS,
    MOCK_REFERRAL_LOGS
} from './api/mockData';

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
    it('should upload a file and return extracted data', async () => {
        const res = await request(app)
            .post('/upload')
            .attach('file', Buffer.from('test content'), 'test.pdf');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(MOCK_UPLOAD_RESPONSE);
    });

    it('should return 400 if no file uploaded', async () => {
        const res = await request(app).post('/upload');
        expect(res.status).toBe(400);
    });
});

describe('POST /orchestrate', () => {
    it('should return orchestration results', async () => {
        const res = await request(app)
            .post('/orchestrate')
            .send({
                documentId: 'doc-123',
                referralData: {}
            });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(MOCK_ORCHESTRATION_RESPONSE);
    });
});

describe('GET /referrals', () => {
    it('should return list of referrals', async () => {
        const res = await request(app).get('/referrals');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(MOCK_REFERRALS_LIST);
    });
});

describe('GET /referral/:id', () => {
    it('should return referral details for valid ID', async () => {
        const res = await request(app).get('/referral/ref-001');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(MOCK_REFERRAL_DETAILS);
    });

    it('should return 404 for invalid ID', async () => {
        const res = await request(app).get('/referral/invalid-id');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('REFERRAL_NOT_FOUND');
    });
});

describe('GET /referral/:id/logs', () => {
    it('should return referral logs for valid ID', async () => {
        const res = await request(app).get('/referral/ref-001/logs');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(MOCK_REFERRAL_LOGS);
    });

    it('should return 404 for invalid ID', async () => {
        const res = await request(app).get('/referral/invalid-id/logs');
        expect(res.status).toBe(404);
    });
});
