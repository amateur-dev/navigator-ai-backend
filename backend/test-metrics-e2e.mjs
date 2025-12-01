import fetch from 'node-fetch';

const RAINDROP_BASE_URL = process.env.RAINDROP_BASE_URL || 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';

async function testMetricsEndpoint() {
    console.log('Testing /metrics endpoint on Raindrop...\n');

    try {
        const response = await fetch(`${RAINDROP_BASE_URL}/metrics`);

        if (!response.ok) {
            throw new Error(`Failed to get metrics: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();

        console.log('✅ Metrics endpoint is live!\n');
        console.log('Response structure:');
        console.log(JSON.stringify(json, null, 2));

        // Validate structure
        const checks = [
            json.success === true,
            json.data !== undefined,
            json.data.overview !== undefined,
            json.data.referralsByStatus !== undefined,
            json.data.topSpecialties !== undefined,
            json.data.insuranceBreakdown !== undefined,
            json.data.appointments !== undefined,
            json.data.providers !== undefined,
            json.data.trends !== undefined,
            json.data.urgencyLevels !== undefined,
            json.data.efficiency !== undefined,
            json.data.alerts !== undefined,
            json.data.timestamp !== undefined
        ];

        const passed = checks.filter(c => c).length;
        console.log(`\n✅ Structure validation: ${passed}/${checks.length} checks passed`);

        if (passed === checks.length) {
            console.log('\n🎉 All metrics endpoint tests PASSED!');
            process.exit(0);
        } else {
            console.log('\n⚠️  Some structure checks failed');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

testMetricsEndpoint();
