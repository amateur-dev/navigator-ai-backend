#!/usr/bin/env node
/**
 * Verify Backend Extraction Works
 * Queries production for recent referrals to check phone/email extraction
 */

async function verifyExtraction() {
  const PROD_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';
  
  console.log('🔍 VERIFYING BACKEND EXTRACTION\n');
  console.log(`Target: ${PROD_URL}\n`);
  
  try {
    // Fetch recent referrals
    const response = await fetch(`${PROD_URL}/referrals`);
    
    if (!response.ok) {
      console.error(`❌ Failed to fetch referrals: ${response.status}`);
      process.exit(1);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('❌ API returned success=false');
      process.exit(1);
    }
    
    const referrals = data.data.referrals;
    
    console.log(`📊 Total Referrals: ${referrals.length}\n`);
    
    if (referrals.length === 0) {
      console.log('⚠️  No referrals in database yet');
      process.exit(0);
    }
    
    // Display recent referrals with extraction results
    console.log('📋 RECENT REFERRALS & EXTRACTION STATUS:');
    console.log('═'.repeat(100));
    
    let phoneCount = 0;
    let emailCount = 0;
    let bothCount = 0;
    
    for (let i = 0; i < Math.min(10, referrals.length); i++) {
      const ref = referrals[i];
      const hasPhone = ref.patientPhoneNumber && ref.patientPhoneNumber !== 'null' && ref.patientPhoneNumber !== 'Unknown';
      const hasEmail = ref.patientEmail && ref.patientEmail !== 'null' && ref.patientEmail !== 'Unknown';
      
      if (hasPhone) phoneCount++;
      if (hasEmail) emailCount++;
      if (hasPhone && hasEmail) bothCount++;
      
      console.log(`\n[${i + 1}] ${ref.patientFirstName || '?'} ${ref.patientLastName || '?'}`);
      console.log(`    Status: ${ref.status}`);
      console.log(`    Phone:  ${hasPhone ? `✅ ${ref.patientPhoneNumber}` : '❌ null/Unknown'}`);
      console.log(`    Email:  ${hasEmail ? `✅ ${ref.patientEmail}` : '❌ null/Unknown'}`);
      console.log(`    Reason: ${ref.reason || 'N/A'}`);
    }
    
    console.log('\n' + '═'.repeat(100));
    console.log('\n📊 EXTRACTION ANALYSIS:');
    console.log(`  • Total referrals checked: ${Math.min(10, referrals.length)}`);
    console.log(`  • With phone number: ${phoneCount}/${Math.min(10, referrals.length)}`);
    console.log(`  • With email: ${emailCount}/${Math.min(10, referrals.length)}`);
    console.log(`  • With BOTH: ${bothCount}/${Math.min(10, referrals.length)}`);
    
    console.log('\n🔎 VERDICT:');
    if (phoneCount > 0 || emailCount > 0) {
      console.log('✅ EXTRACTION IS WORKING!');
      console.log('   Backend successfully extracting phone/email from PDFs');
      if (phoneCount === Math.min(10, referrals.length) && emailCount === Math.min(10, referrals.length)) {
        console.log('   ✓ Success rate: 100% - Both fields extracted consistently');
      } else {
        console.log(`   ⚠️  Success rate: ${Math.round((bothCount / Math.min(10, referrals.length)) * 100)}% - Varies by document`);
      }
    } else {
      console.log('❌ EXTRACTION NOT WORKING');
      console.log('   Backend NOT extracting phone/email from PDFs');
      console.log('   Possible causes:');
      console.log('   • PDFs are scanned/image-only (no machine-readable text)');
      console.log('   • Phone/email not in PDF content');
      console.log('   • CEREBRAS AI not recognizing format');
    }
    
    console.log('\n' + '═'.repeat(100));
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

verifyExtraction();
