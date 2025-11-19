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

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

export default app;
