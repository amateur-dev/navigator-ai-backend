/**
 * Script to seed demo referrals to production backend
 * Reads from the generated demo-referrals-15.json and POSTs to /orchestrate endpoint
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const PRODUCTION_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';

async function seedReferrals() {
  try {
    // Read the demo data
    const demoDataPath = path.join(__dirname, '..', 'temp', 'demo-referrals-15.json');
    const demoReferrals = JSON.parse(fs.readFileSync(demoDataPath, 'utf8'));

    console.log(`📤 Seeding ${demoReferrals.length} referrals with proper life cycles to production backend...\n`);

    // Prepare the data for seeding - extract referrals and logs
    const referrals = demoReferrals.map(ref => ({
      id: ref.id,
      patientFirstName: ref.patientFirstName,
      patientLastName: ref.patientLastName,
      patientEmail: ref.patientEmail,
      patientPhoneNumber: ref.patientPhoneNumber,
      age: ref.age,
      specialty: ref.specialty,
      payer: ref.payer,
      plan: ref.plan,
      status: ref.status,
      urgency: ref.urgency,
      appointmentDate: ref.appointmentDate,
      referralDate: ref.referralDate,
      noShowRisk: ref.noShowRisk,
      providerName: ref.providerName,
      facilityName: ref.facilityName,
      reason: ref.reason,
      steps: ref.steps,
      primaryChannel: ref.primaryChannel
    }));

    // Extract logs
    const logs = {};
    demoReferrals.forEach(ref => {
      if (ref.actionLog && ref.actionLog.length > 0) {
        logs[ref.id] = ref.actionLog;
      }
    });

    const seedData = { referrals, logs };

    // Seed all data at once
    const result = await postSeedData(seedData);
    console.log(`✅ Successfully seeded ${referrals.length} referrals with ${Object.keys(logs).length} log entries`);

    // Show distribution
    const stages = {};
    referrals.forEach(ref => {
      const current = ref.steps.find(s => s.status === 'current')?.label || 'All Complete';
      stages[current] = (stages[current] || 0) + 1;
    });

    console.log('\n📊 Life Cycle Distribution:');
    Object.entries(stages).forEach(([stage, count]) => {
      console.log(`  ${stage}: ${count} referrals`);
    });

  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  }
}

function postSeedData(seedData) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(seedData);

    const options = {
      hostname: 'svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run',
      path: '/seed',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Run the seeding
seedReferrals().catch(console.error);