import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

const app = express();
const PORT = process.env.PORT || 3001;

// Configure middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize CEREBRAS client
const cerebras = new Cerebras({
    apiKey: process.env.CEREBRAS_API_KEY,
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'vultr-extraction' });
});

// PDF Extraction endpoint
app.post('/extract', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(`📄 Processing PDF: ${req.file.originalname} (${req.file.size} bytes)`);

        // Step 1: Extract text from PDF using pdf-parse
        let pdfText = '';
        try {
            const pdfData = await pdfParse(req.file.buffer);
            pdfText = pdfData.text;
            console.log(`✅ Extracted ${pdfText.length} characters from PDF`);
        } catch (pdfError) {
            console.error('❌ PDF parsing error:', pdfError);
            return res.status(500).json({
                error: 'Failed to parse PDF',
                details: pdfError.message
            });
        }

        if (!pdfText || pdfText.trim().length === 0) {
            return res.status(400).json({
                error: 'PDF appears to be empty or contains only images',
                suggestion: 'Ensure PDF contains selectable text'
            });
        }

        // Step 2: Use CEREBRAS AI to parse and structure the text
        console.log('🤖 Sending to CEREBRAS AI for intelligent parsing...');

        const prompt = `You are a medical document data extractor. Below is text extracted from a medical referral PDF.

EXTRACTED TEXT:
"""
${pdfText}
"""

Extract the following information and return it as a JSON object:

{
  "patientName": "Full patient name (first and last)",
  "dateOfBirth": "Patient's date of birth in YYYY-MM-DD format",
  "patientPhoneNumber": "Patient's phone number",
  "referralReason": "The medical condition, diagnosis, or symptoms mentioned",
  "insuranceProvider": "Insurance provider/payer company name",
  "specialty": "The medical specialty being referred to",
  "urgency": "The urgency level (e.g., routine, urgent)",
  "providerName": "The referring physician's name",
  "plan": "The insurance plan name or policy number"
}

Instructions:
- Extract EXACTLY what you see in the text above
- For dates, convert any format to YYYY-MM-DD (e.g., "July 22, 1985" becomes "1985-07-22")
- Look for keywords like "Name:", "DOB:", "Patient:", "Insurance:", "Diagnosis:", "Reason:", "Phone:"
- If a field is not found, use "Unknown"
- Return ONLY valid JSON, no markdown or explanation`;

        const completion = await cerebras.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3.1-8b',
            temperature: 0.1, // Low temperature for precise extraction
            max_completion_tokens: 500
        });

        const aiResponse = completion.choices[0]?.message?.content || '';
        console.log('🎯 CEREBRAS Response:', aiResponse.substring(0, 200));

        // Step 3: Parse JSON from AI response
        let extractedData;
        try {
            const cleanJson = aiResponse.replace(/```json\n|\n```/g, '').replace(/```/g, '').trim();
            const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                extractedData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in AI response');
            }
        } catch (parseError) {
            console.error('❌ Failed to parse AI response:', aiResponse);
            return res.status(500).json({
                error: 'Failed to parse AI response',
                rawResponse: aiResponse
            });
        }

        console.log('✅ Extraction complete:', extractedData);

        return res.json({
            success: true,
            data: extractedData,
            metadata: {
                filename: req.file.originalname,
                fileSize: req.file.size,
                textLength: pdfText.length,
                extractedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('💥 Extraction error:', error);
        return res.status(500).json({
            error: 'Extraction failed',
            message: error.message
        });
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║   🚀 Vultr PDF Extraction Service                        ║
╚══════════════════════════════════════════════════════════╝

📍 Server running on: http://0.0.0.0:${PORT}
🤖 AI Engine: CEREBRAS (llama3.1-8b)
📄 PDF Parser: pdf-parse
✅ Ready to extract medical referrals!

Endpoints:
  GET  /health  - Health check
  POST /extract - Extract patient data from PDF
  `);
});
