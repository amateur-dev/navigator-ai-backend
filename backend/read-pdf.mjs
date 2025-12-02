#!/usr/bin/env node

import fs from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_PATH = path.join(__dirname, 'Medical Referral Document 9.pdf');

async function readPdf() {
    try {
        const dataBuffer = fs.readFileSync(PDF_PATH);
        const data = await pdf(dataBuffer);
        console.log(data.text);
    } catch (error) {
        console.error('Error reading PDF:', error);
    }
}

readPdf();
