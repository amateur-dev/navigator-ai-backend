import request from 'supertest';
import app from './server';
import path from 'path';

// Mock Raindrop SDK
jest.mock('@liquidmetal-ai/lm-raindrop', () => {
    return jest.fn().mockImplementation(() => ({
        object: {
            upload: jest.fn().mockResolvedValue({ bucket: 'referral-docs' }),
        },
    }));
});

describe('GET /ping', () => {
    it('should return pong', async () => {
        const res = await request(app).get('/ping');
        expect(res.status).toBe(200);
        expect(res.text).toBe('pong');
    });
});

describe('POST /upload', () => {
    it('should upload a file', async () => {
        const res = await request(app)
            .post('/upload')
            .attach('file', Buffer.from('test content'), 'test.txt');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('File uploaded successfully');
        expect(res.body.filename).toBe('test.txt');
    });

    it('should return 400 if no file uploaded', async () => {
        const res = await request(app).post('/upload');
        expect(res.status).toBe(400);
    });
});

describe('POST /extract', () => {
    it('should return extracted data', async () => {
        const res = await request(app)
            .post('/extract')
            .send({ filename: 'test.txt' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('patientName', 'John Doe');
        expect(res.body).toHaveProperty('referralReason');
    });

    it('should return 400 if no filename provided', async () => {
        const res = await request(app).post('/extract').send({});
        expect(res.status).toBe(400);
    });
});

describe('POST /orchestrate', () => {
    it('should return orchestration results', async () => {
        const res = await request(app)
            .post('/orchestrate')
            .send({
                patientName: 'John Doe',
                referralReason: 'Cardiology consultation',
                insuranceProvider: 'BlueCross',
            });

        expect(res.status).toBe(200);
        expect(res.body.specialist).toBe('Cardiologist');
        expect(res.body.insuranceStatus).toBe('Approved');
        expect(res.body.availableSlots).toHaveLength(2);
    });

    it('should return 400 if missing fields', async () => {
        const res = await request(app).post('/orchestrate').send({});
        expect(res.status).toBe(400);
    });
});
