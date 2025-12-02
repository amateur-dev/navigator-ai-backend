
const API_URL = 'https://svc-01katb1a5pyby9ds4qw3b2eqkk.01ka4p71jdecn1j7gq8bb23n03.lmapp.run';
const DOC_ID = 'doc-1764637173395-fdndkhv8si';

async function retryExtract() {
    console.log(`Retrying extraction for ${DOC_ID}...`);
    
    for (let i = 0; i < 5; i++) {
        console.log(`Attempt ${i + 1}...`);
        try {
            const res = await fetch(`${API_URL}/extract`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: DOC_ID })
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log('✅ Success:', JSON.stringify(data, null, 2));
                return;
            } else {
                console.log(`❌ Failed: ${res.status}`);
                const text = await res.text();
                console.log(`   Response: ${text}`);
            }
        } catch (e) {
            console.error('Error:', e.message);
        }
        
        console.log('Waiting 5s...');
        await new Promise(r => setTimeout(r, 5000));
    }
}

retryExtract();
