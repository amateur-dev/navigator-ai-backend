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

const upload = multer({ dest: 'uploads/' });
const client = new Raindrop({ apiKey: process.env.RAINDROP_API_KEY || 'mock-key' });

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    try {
        const fileStream = fs.createReadStream(req.file.path);
        // @ts-ignore
        await client.object.upload(req.file.originalname, {
            bucket: 'referral-docs',
            body: fileStream,
        });

        // Clean up local file
        fs.unlinkSync(req.file.path);

        res.status(200).send({ message: 'File uploaded successfully', filename: req.file.originalname });
    } catch (error) {
        console.error('Upload error:', error);
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
    } else if (referralReason.toLowerCase().includes('derma')) {
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

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

export default app;
