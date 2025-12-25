const axios = require('axios');

async function testRegister() {
    try {
        // 1. First ensure the email is whitelisted (we can't easily do this via API without admin token, 
        // asking user to assume 'test@example.com' is whitelisted or I'll just try to register a random one if I can)

        // Actually, I'll just try to register a new email.
        // If it's not whitelisted, I expect 403.
        // If it IS whitelisted (but not in Users), I expect 201.

        // Let's rely on the user's claim or checking the DB directly if I could.
        // For now, I will try to register 'whitelist_test@example.com' with password 'password'.

        const email = 'sigi@wesk.com'; // I'll use a likely whitelisted email or just check what is allowed.
        // Wait, I can verify what is allowed using check_db.js if I modify it.

        const response = await axios.post('http://localhost:3000/api/auth/register', {
            email: 'test_allowed@example.com',
            password: 'password123'
        });

        console.log('Registration success:', response.data);
    } catch (error) {
        console.error('Registration failed:', error.response ? error.response.data : error.message);
    }
}

testRegister();
