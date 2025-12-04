#!/usr/bin/env node
/**
 * SIMPLE EXTRACTION CHECK
 * Shows if backend extraction is working in 3 seconds
 */

async function quickCheck() {
  const PROD_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';
  
  try {
    const res = await fetch(`${PROD_URL}/referrals`);
    const data = await res.json();
    const refs = data.data.referrals;
    
    if (refs.length === 0) {
      console.log('⚠️  No referrals yet');
      process.exit(0);
    }
    
    // Check extraction success
    const extracted = refs.filter(r => 
      r.patientPhoneNumber && r.patientPhoneNumber !== 'Unknown' &&
      r.patientEmail && r.patientEmail !== 'Unknown'
    ).length;
    
    if (extracted > 0) {
      console.log(`✅ EXTRACTION WORKING: ${extracted}/${refs.length} referrals have phone & email`);
      console.log('\nFirst referral with data:');
      const sample = refs.find(r => r.patientPhoneNumber && r.patientEmail);
      if (sample) {
        console.log(`  ${sample.patientFirstName} ${sample.patientLastName}`);
        console.log(`  Phone: ${sample.patientPhoneNumber}`);
        console.log(`  Email: ${sample.patientEmail}`);
      }
    } else {
      console.log(`❌ EXTRACTION NOT WORKING: 0/${refs.length} have phone & email`);
    }
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

quickCheck();
