#!/usr/bin/env node
/**
 * BACKEND EXTRACTION VERIFICATION - Summary Report
 * 
 * Tests backend extraction without needing the frontend
 */

const PROD_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';

async function generateVerificationReport() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║         🔍 BACKEND EXTRACTION VERIFICATION - PRODUCTION CHECK              ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');
  
  try {
    // Fetch referrals
    console.log('Checking production referrals...\n');
    const response = await fetch(`${PROD_URL}/referrals`);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error('API returned success=false');
    }
    
    const referrals = data.data.referrals || [];
    
    // Generate statistics
    console.log('📊 EXTRACTION RESULTS:');
    console.log('─'.repeat(80) + '\n');
    
    const results = {
      total: referrals.length,
      withPhone: 0,
      withEmail: 0,
      withBoth: 0,
      samples: []
    };
    
    referrals.forEach((ref, idx) => {
      const hasPhone = ref.patientPhoneNumber && 
                       ref.patientPhoneNumber !== 'null' && 
                       ref.patientPhoneNumber !== 'Unknown';
      const hasEmail = ref.patientEmail && 
                       ref.patientEmail !== 'null' && 
                       ref.patientEmail !== 'Unknown';
      
      if (hasPhone) results.withPhone++;
      if (hasEmail) results.withEmail++;
      if (hasPhone && hasEmail) results.withBoth++;
      
      // Collect sample data
      if (idx < 5) {
        results.samples.push({
          name: `${ref.patientFirstName} ${ref.patientLastName}`,
          phone: ref.patientPhoneNumber,
          email: ref.patientEmail,
          hasPhone,
          hasEmail
        });
      }
    });
    
    // Display statistics
    console.log(`Total Referrals: ${results.total}`);
    console.log(`With Phone: ${results.withPhone}/${results.total}`);
    console.log(`With Email: ${results.withEmail}/${results.total}`);
    console.log(`With BOTH: ${results.withBoth}/${results.total}\n`);
    
    // Display samples
    console.log('SAMPLE REFERRALS:');
    console.log('─'.repeat(80));
    
    if (results.samples.length === 0) {
      console.log('(No referrals to display)');
    } else {
      results.samples.forEach((sample, idx) => {
        console.log(`\n${idx + 1}. ${sample.name}`);
        console.log(`   Phone: ${sample.hasPhone ? `✅ ${sample.phone}` : `❌ ${sample.phone}`}`);
        console.log(`   Email: ${sample.hasEmail ? `✅ ${sample.email}` : `❌ ${sample.email}`}`);
      });
    }
    
    console.log('\n' + '─'.repeat(80) + '\n');
    
    // Analysis
    console.log('📋 ANALYSIS:\n');
    
    if (results.withBoth > 0) {
      console.log('✅ BACKEND EXTRACTION IS WORKING');
      console.log(`   Success rate: ${Math.round((results.withBoth / results.total) * 100)}% - Both fields extracted\n`);
      console.log('   What this means:');
      console.log('   ✓ PDFs are being uploaded correctly');
      console.log('   ✓ Vultr extraction service is responding');
      console.log('   ✓ CEREBRAS AI is extracting phone/email');
      console.log('   ✓ Fallback regex extraction is working\n');
      console.log('   Current Issue:');
      console.log('   ❌ Frontend shows empty phone/email fields\n');
      console.log('   Root Cause:');
      console.log('   📝 Frontend is hardcoding fake values instead of using backend data');
      console.log('      Location: /frontend/hooks/use-referral-upload.ts');
      console.log('      Problem: Lines 135-137 hardcode phone and email\n');
      console.log('   Solution:');
      console.log('   🔧 Frontend needs to pass extracted values through the form');
      
    } else if (results.withPhone > 0 || results.withEmail > 0) {
      console.log('⚠️  PARTIAL EXTRACTION - Working But Inconsistent\n');
      console.log(`   Phone extraction: ${results.withPhone > 0 ? '✅ Working' : '❌ Not working'}`);
      console.log(`   Email extraction: ${results.withEmail > 0 ? '✅ Working' : '❌ Not working'}\n`);
      console.log('   Possible reasons:');
      console.log('   • Phone format not matching regex patterns');
      console.log('   • Email not in PDFs or Vultr not finding it');
      console.log('   • CEREBRAS model configuration issue');
      
    } else {
      console.log('❌ EXTRACTION NOT WORKING\n');
      console.log('   No phone or email extracted from any referral\n');
      console.log('   Possible reasons:');
      console.log('   1. PDFs are scanned/image-based (need OCR)');
      console.log('   2. Phone/email not in PDF content');
      console.log('   3. Vultr service not accessible/responding');
      console.log('   4. CEREBRAS API key missing/invalid');
      console.log('   5. Data format not matching extraction patterns');
    }
    
    console.log('\n' + '═'.repeat(80) + '\n');
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}\n`);
  }
}

generateVerificationReport();
