
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  const text = `
PEDIATRIC PSYCHIATRY REFERRAL
Date: December 1, 2025
Referral ID: UCLA-PSYCH-2291

REFERRING PHYSICIAN
Dr. Benjamin Lee, MD
Pediatrician
Westside Pediatrics Group
Phone: (310) 555-4201
Email: b.lee@westsidepeds.com

PATIENT INFORMATION
Name: Jason Miller
DOB: April 12, 2015 (Age: 10)
Gender: Male
Parent/Guardian: Sarah and Tom Miller
MRN: UCLA-882910
Insurance: Anthem Blue Cross PPO
Policy #: ANTH-CA-993821
Phone: (310) 555-1928
Address: 22 Ocean Ave, Santa Monica, CA 90401

REFERRAL TO
Specialty: Child & Adolescent Psychiatry
Reason: Suspected ADHD and increasing anxiety behaviors
Urgency: Routine (within 4 weeks)
  `;

  page.drawText(text, {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('Medical Referral Document 9 Clean.pdf', pdfBytes);
  console.log('Created clean PDF');
}

createPdf();
