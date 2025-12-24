const { sequelize, User, Chalet } = require('./models');
const bcrypt = require('bcrypt');

const seed = async () => {
    try {
        await sequelize.sync({ force: true }); // Reset DB

        // Create Admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            email: 'admin@wesk.com',
            password: hashedPassword,
            isAdmin: true,
        });

        // Create Chalets
        const chalets = [
            { name: 'Le Refuge', description: 'Cozy wooden chalet near the slopes.', capacity: 6 },
            { name: 'L\'Etoile des Neiges', description: 'Modern chalet with a great view.', capacity: 6 },
            { name: 'Le Grand Duc', description: 'Spacious and luxurious.', capacity: 6 },
            { name: 'Les Marmottes', description: 'Perfect for friends.', capacity: 6 },
            { name: 'Chalet Suisse', description: 'Traditional style.', capacity: 6 },
        ];

        await Chalet.bulkCreate(chalets);

        console.log('Database seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
