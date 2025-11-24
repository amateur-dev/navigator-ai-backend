#!/usr/bin/env node

// Test script for /confirm endpoint
const API_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';

console.log('Testing Confirmation Endpoint\n');

async function testConfirm() {
    try {
        const response = await fetch(`${API_URL}/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                referralId: 'ref-123',
                patientName: 'John Doe',
                patientEmail: 'john.doe@email.com',
                patientPhone: '+1-555-0123',
                doctorName: 'Dr. James Mitchell',
                specialty: 'Cardiologist',
                appointmentDate: '2024-11-26',
                appointmentTime: '10:00 AM',
                facilityName: 'Downtown Medical Center',
                facilityAddress: '123 Main Street, Suite 200, New York, NY 10001'
            })
        });

        console.log(`Status: ${response.status}\n`);
        const result = await response.json();

        console.log('=== CONFIRMATION RESPONSE ===\n');
        console.log(JSON.stringify(result, null, 2));

        if (result.success && result.notifications) {
            console.log('\n\n=== SMS PREVIEW ===');
            console.log(`To: ${result.notifications.sms.to}`);
            console.log(`Message: ${result.notifications.sms.message}`);
            console.log(`Length: ${result.notifications.sms.length} characters`);

            console.log('\n\n=== EMAIL PREVIEW ===');
            console.log(`To: ${result.notifications.email.to}`);
            console.log(`Subject: ${result.notifications.email.subject}`);
            console.log('\nBody:\n');
            console.log(result.notifications.email.body);

            console.log('\n\n✅ Confirmation endpoint working perfectly!');
            console.log('📱 Perfect for hackathon demo - shows exactly what would be sent');
        } else {
            console.log('\n❌ Unexpected response format');
        }
    } catch (e) {
        console.error('Test failed:', e.message);
    }
}

testConfirm();
