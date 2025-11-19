import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.get('/ping', (req, res) => {
    res.send('pong');
});
import multer from 'multer';
import Raindrop from '@liquidmetal-ai/lm-raindrop';
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
        res.status(200).json({ message: 'File uploaded successfully', filename: req.file.originalname });
    }
    catch (error) {
        console.error('Upload error:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
        console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
        res.status(500).send('Upload failed');
    }
});
app.post('/extract', async (req, res) => {
    const { filename } = req.body;
    if (!filename) {
        return res.status(400).send('Filename is required');
    }
    // Mock AI extraction
    const extractedData = {
        patientName: 'John Doe',
        dateOfBirth: '1980-01-01',
        referralReason: 'Cardiology consultation',
        insuranceProvider: 'BlueCross',
    };
    res.status(200).json(extractedData);
});
app.post('/orchestrate', async (req, res) => {
    const { patientName, referralReason, insuranceProvider } = req.body;
    if (!patientName || !referralReason) {
        return res.status(400).send('Missing required fields');
    }
    // Mock Specialist Inference
    let specialist = 'General Practitioner';
    if (referralReason.toLowerCase().includes('cardio')) {
        specialist = 'Cardiologist';
    }
    else if (referralReason.toLowerCase().includes('derma')) {
        specialist = 'Dermatologist';
    }
    // Mock Insurance Check
    const insuranceStatus = insuranceProvider === 'BlueCross' ? 'Approved' : 'Pending';
    // Mock Schedule Lookup (SmartSQL)
    const availableSlots = [
        '2025-11-20T10:00:00Z',
        '2025-11-21T14:00:00Z',
    ];
    res.status(200).json({
        specialist,
        insuranceStatus,
        availableSlots,
    });
});
app.post('/confirm', async (req, res) => {
    const { patientName, slot } = req.body;
    if (!patientName || !slot) {
        return res.status(400).send('Missing required fields');
    }
    // Mock SMS/Email dispatch
    console.log(`Sending confirmation to ${patientName} for slot ${slot}`);
    res.status(200).json({
        message: 'Confirmation sent successfully',
        status: 'Sent',
    });
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
