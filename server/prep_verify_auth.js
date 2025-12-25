const { AllowedUser, User, sequelize } = require('./src/models');

async function prep() {
    try {
        const testEmail = 'verify_auth@wesk.com';

        // Cleanup
        await User.destroy({ where: { email: testEmail } });
        await AllowedUser.destroy({ where: { email: testEmail } });

        // Whitelist
        await AllowedUser.create({ email: testEmail });

        console.log('DB Prepared: verify_auth@wesk.com is in whitelist but not registered.');
    } catch (e) {
        console.error(e);
    }
}
prep();
