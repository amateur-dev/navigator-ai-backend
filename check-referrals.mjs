#!/usr/bin/env node
/**
 * Simple test to check if phone/email extraction is working
 * Queries production API for recent referrals
 */

const PROD_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';

async function checkRecentReferrals() {
  console.log('🔍 Checking Recent Referrals from Production\n');
  
  try {
    console.log(`Fetching from: ${PROD_URL}/referrals\n`);
    const res = await fetch(`${PROD_URL}/referrals`);
    
    if (!res.ok) {
      console.error(`❌ API returned ${res.status}`);
      process.exit(1);
    }
    
    const data = await res.json();
    
    if (!data.success) {
      console.error(`❌ Response success=false`);
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }
    
    const referrals = data.data.referrals;
    console.log(`📊 Total Referrals: ${referrals.length}\n`);
    
    if (referrals.length === 0) {
      console.log('ℹ️  No referrals in database');
      process.exit(0);
    }
    
    // Show most recent referrals
    console.log('📋 Most Recent Referrals:');
    console.log('─'.repeat(80));
    
    for (let i = 0; i < Math.min(5, referrals.length); i++) {
      const ref = referrals[i];
      console.log(`\n[${i + 1}] ${ref.patientFirstName} ${ref.patientLastName}`);
      console.log(`    Status: ${ref.status}`);
      console.log(`    Phone: ${ref.patientPhoneNumber || '❌ NOT EXTRACTED'}`);
      console.log(`    Email: ${ref.patientEmail || '❌ NOT EXTRACTED'}`);
      console.log(`    Reason: ${ref.reason || 'N/A'}`);
      console.log(`    Created: ${new Date(ref.createdAt).toLocaleString()}`);
    }
    
    console.log('\n' + '─'.repeat(80));
    
    // Analysis
    console.log('\n📊 Analysis:');
    const withPhone = referrals.filter(r => r.patientPhoneNumber && r.patientPhoneNumber !== 'null' && r.patientPhoneNumber !== 'Unknown');
    const withEmail = referrals.filter(r => r.patientEmail && r.patientEmail !== 'null' && r.patientEmail !== 'Unknown');
    
    console.log(`  • Referrals with phone: ${withPhone.length}/${referrals.length}`);
    console.log(`  • Referrals with email: ${withEmail.length}/${referrals.length}`);
    
    if (withPhone.length > 0 || withEmail.length > 0) {
      console.log(`\n✅ Extraction is working! Backend successfully extracting data.`);
    } else {
      console.log(`\n⚠️  Extraction may not be working. No phone/email in recent referrals.`);
    }
    
    console.log('\nFull Response:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

checkRecentReferrals();
