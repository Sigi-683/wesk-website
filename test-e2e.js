// const fetch = require('node-fetch'); // Rely on native fetch in Node 18+

const BASE_URL = 'http://localhost:3000/api';
let userAToken, userBToken, adminToken;
let chaletId;

async function test() {
    console.log('--- Starting E2E Verification ---');

    // 1. Register User A
    console.log('1. Registering User A...');
    const resA = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `usera_${Date.now()}@test.com`, password: 'password123' })
    });
    const dataA = await resA.json();
    if (!resA.ok) throw new Error(`User A registration failed: ${JSON.stringify(dataA)}`);
    userAToken = dataA.token;
    console.log('   User A registered.');

    // 2. Register User B
    console.log('2. Registering User B...');
    const resB = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `userb_${Date.now()}@test.com`, password: 'password123' })
    });
    const dataB = await resB.json();
    if (!resB.ok) throw new Error(`User B registration failed: ${JSON.stringify(dataB)}`);
    userBToken = dataB.token;
    console.log('   User B registered.');

    // 3. Get Chalets (User A)
    console.log('3. Fetching Chalets...');
    const resChalets = await fetch(`${BASE_URL}/chalets`, {
        headers: { 'Authorization': `Bearer ${userAToken}` }
    });
    const chalets = await resChalets.json();
    if (!resChalets.ok || chalets.length === 0) throw new Error('Failed to fetch chalets or none found');
    chaletId = chalets[0].id; // Pick first chalet
    console.log(`   Found ${chalets.length} chalets. Using ID: ${chaletId}`);

    // 4. User A Selects Chalet
    console.log('4. User A selecting chalet...');
    const resSelectA = await fetch(`${BASE_URL}/chalets/${chaletId}/select`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userAToken}` }
    });
    if (!resSelectA.ok) {
        const err = await resSelectA.json();
        throw new Error(`User A failed to select: ${JSON.stringify(err)}`);
    }
    console.log('   User A selected chalet.');

    // 5. User B tries to select same Chalet (Should Fail)
    console.log('5. User B trying to select same chalet (Expect Failure)...');
    const resSelectB = await fetch(`${BASE_URL}/chalets/${chaletId}/select`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userBToken}` }
    });
    if (resSelectB.ok) throw new Error('User B should NOT have been able to select the chalet');
    console.log('   User B correctly blocked.');

    // 6. User B tries to select another chalet (Should Succeed if available, assuming >1 chalet)
    const anotherChalet = chalets.find(c => c.id !== chaletId);
    if (anotherChalet) {
        console.log('6. User B selecting another chalet...');
        const resSelectB2 = await fetch(`${BASE_URL}/chalets/${anotherChalet.id}/select`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${userBToken}` }
        });
        if (!resSelectB2.ok) {
            const err = await resSelectB2.json();
            throw new Error(`User B failed to select another: ${JSON.stringify(err)}`);
        }
        console.log('   User B selected another chalet.');
    }

    console.log('--- Verification Passed Successfully ---');
}

test().catch(err => {
    console.error('--- Verification FAILED ---');
    console.error(err);
    process.exit(1);
});
