import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.get('/ping', (req, res) => {
    res.send('pong');
});
import multer from 'multer';
import Raindrop from '@liquidmetal-ai/lm-raindrop';
import { MOCK_UPLOAD_RESPONSE, MOCK_ORCHESTRATION_RESPONSE, MOCK_REFERRALS_LIST, MOCK_REFERRAL_DETAILS, MOCK_REFERRAL_LOGS } from './api/mockData.js';
const upload = multer({ dest: 'uploads/' });
const client = new Raindrop({ apiKey: process.env.RAINDROP_API_KEY || 'mock-key' });
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    try {
        // For local development, we just keep the file in uploads/
        // In production with Raindrop, this would upload to SmartBucket
        console.log(`File uploaded: ${req.file.originalname} (${req.file.size} bytes)`);
        console.log(`Saved to: ${req.file.path}`);
        res.status(200).json(MOCK_UPLOAD_RESPONSE);
    }
    catch (error) {
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
app.post('/orchestrate', async (req, res) => {
    try {
        // const { documentId, referralData } = req.body;
        res.status(200).json(MOCK_ORCHESTRATION_RESPONSE);
    }
    catch (error) {
        console.error('Orchestrate error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: "ORCHESTRATION_FAILED",
                message: "Failed to start orchestration",
                statusCode: 500
            }
        });
    }
});
app.get('/referrals', (req, res) => {
    res.status(200).json(MOCK_REFERRALS_LIST);
});
app.get('/referral/:id', (req, res) => {
    const { id } = req.params;
    if (id === 'ref-001') {
        res.status(200).json(MOCK_REFERRAL_DETAILS);
    }
    else {
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
    if (id === 'ref-001') {
        res.status(200).json(MOCK_REFERRAL_LOGS);
    }
    else {
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
