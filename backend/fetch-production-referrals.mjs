#!/usr/bin/env node

/**
 * Fetch all referrals from production system
 */

const PRODUCTION_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';

async function fetchProductionReferrals() {
    console.log('📋 Fetching all referrals from production...');
    console.log(`📍 URL: ${PRODUCTION_URL}/referrals\n`);

    try {
        const response = await fetch(`${PRODUCTION_URL}/referrals`);

        if (!response.ok) {
            throw new Error(`Failed to fetch referrals: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error('Response indicated failure');
        }

        const referrals = data.data.referrals;
        const pagination = data.data.pagination;

        console.log(`✅ Retrieved ${referrals.length} referral(s)\n`);
        console.log('='.repeat(80));
        console.log('REFERRALS LIST');
        console.log('='.repeat(80));

        referrals.forEach((ref, index) => {
            console.log(`\n${index + 1}. ${ref.patientFirstName} ${ref.patientLastName}`);
            console.log(`   ID: ${ref.id}`);
            console.log(`   Email: ${ref.patientEmail}`);
            console.log(`   Specialty: ${ref.specialty}`);
            console.log(`   Payer: ${ref.payer}`);
            console.log(`   Status: ${ref.status}`);
            console.log(`   Appointment: ${ref.appointmentDate ? new Date(ref.appointmentDate).toLocaleString() : 'Not scheduled'}`);
            console.log(`   Referral Date: ${new Date(ref.referralDate).toLocaleString()}`);
            console.log(`   No-Show Risk: ${ref.noShowRisk}%`);
        });

        console.log('\n' + '='.repeat(80));
        console.log('PAGINATION INFO');
        console.log('='.repeat(80));
        console.log(`Page: ${pagination.page} of ${pagination.totalPages}`);
        console.log(`Total Referrals: ${pagination.total}`);
        console.log(`Showing: ${referrals.length} per page`);

        // Return the data for potential further processing
        return referrals;

    } catch (error) {
        console.error('\n❌ Failed to fetch referrals:', error.message);
        process.exit(1);
    }
}

// Run the fetch
fetchProductionReferrals();
