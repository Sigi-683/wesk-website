const { Chalet, User } = require('./src/models');
const sequelize = require('./src/database');

async function check() {
    try {
        await sequelize.authenticate();
        console.log('DB Connection OK');

        const chalets = await Chalet.findAll({
            include: [{ model: User }]
        });
        console.log(`Found ${chalets.length} chalets.`);
        if (chalets.length > 0) {
            console.log('Sample Chalet:', JSON.stringify(chalets[0], null, 2));
        }

        const users = await User.findAll();
        console.log(`Found ${users.length} users.`);

    } catch (error) {
        console.error('Error checking DB:', error);
    } finally {
        await sequelize.close();
    }
}

check();
