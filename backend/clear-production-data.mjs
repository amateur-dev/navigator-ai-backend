
import fetch from 'node-fetch';

const API_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';

async function clearData() {
    console.log('🧹 Clearing Production Data...');
    console.log(`📍 API URL: ${API_URL}`);

    try {
        // Call the seed endpoint which clears tables and reseeds doctors
        const response = await fetch(`${API_URL}/seed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        console.log('RESPONSE:', response.status, data);

        if (response.ok) {
            console.log('✅ Data cleared and doctors re-seeded successfully.');
        } else {
            console.error('❌ Failed to clear data.');
        }

        // Verify referrals are empty
        console.log('\n🔍 Verifying Referrals List...');
        const listRes = await fetch(`${API_URL}/referrals`);
        const listData = await listRes.json();
        
        if (listData.data && listData.data.referrals) {
            const count = listData.data.referrals.length;
            console.log(`📉 Current Referral Count: ${count}`);
            if (count === 0) {
                console.log('✅ Referrals list is empty.');
            } else {
                console.log('⚠️ Referrals list is NOT empty (unexpected).');
                console.log(listData.data.referrals);
            }
        }

    } catch (error) {
        console.error('💥 Error:', error.message);
    }
}

clearData();
