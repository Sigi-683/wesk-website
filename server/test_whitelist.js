const { AllowedUser, User, sequelize } = require('./src/models');
const axios = require('axios');

async function testWhitelistFlow() {
    try {
        const testEmail = 'valid_user@wesk.com';
        const testPassword = 'validpassword123';

        // 1. Clean up
        await User.destroy({ where: { email: testEmail } });
        await AllowedUser.destroy({ where: { email: testEmail } });

        // 2. Add to Whitelist
        await AllowedUser.create({ email: testEmail });
        console.log(`Added ${testEmail} to whitelist.`);

        // 3. Try to Register
        console.log('Attempting registration...');
        const response = await axios.post('http://localhost:3000/api/auth/register', {
            email: testEmail,
            password: testPassword
        });

        console.log('Registration Response Status:', response.status);
        console.log('Registration Data:', response.data);

    } catch (error) {
        console.error('Registration Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    } finally {
        // cleanup? maybe leave it to verify manually if needed
    }
}

testWhitelistFlow();
