const { Sequelize } = require('sequelize');
const path = require('path');
const Chalet = require('./src/models/Chalet'); // Adjust path as needed based on where we run this
const sequelize = require('./src/database');

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync to ensure table exists (though user said it does, good practice)
        await sequelize.sync();

        const chaletsToCreate = [
            { name: 'Chalet "Le Sauna Humain"', description: 'Parfait pour ceux qui aiment la promiscuité. 6 personnes, 1 douche. Que la force soit avec vous.' },
            { name: 'Chalet "Avalanche de Fromage"', description: 'LIVRÉ AVEC UN APPAREIL À RACLETTE. C\'est tout ce qui compte, non ?' },
            { name: 'Chalet "Les Ronfleurs"', description: 'Murs insonorisés... ou pas. Prévoyez des boules Quies.' },
            { name: 'Chalet "Yéti Palace"', description: 'On a vu une grosse bête poilue rodeuse, mais c\'était peut-être juste le président du BDE.' },
            { name: 'Chalet "Vin Chaud"', description: 'Interdit de vomir dans les lits. Serpillère fournie.' },
            { name: 'Chalet "Les Bronzés"', description: 'Pour ceux qui vont conclure (on le souhaite).' },
            { name: 'Chalet "Pisteur Fou"', description: 'Départ ski aux pieds... si vous savez skier.' },
            { name: 'Chalet "Igloo V.I.P"', description: 'Chauffage en option pour une expérience authentique (on rigole, il fait 25°C).' },
            { name: 'Chalet "Lama Faché"', description: 'Quand il est pas content, il crache. Comme votre coloc du matin.' },
            { name: 'Chalet "Dernier Recours"', description: 'Celui que personne ne voulait, mais qui a quand même un toit.' },
        ];

        for (const c of chaletsToCreate) {
            // Use findOrCreate to avoid duplicates if re-run
            await Chalet.findOrCreate({
                where: { name: c.name },
                defaults: {
                    description: c.description,
                    capacity: 6
                }
            });
        }

        console.log('✅ 10 Chalets seeded successfully with humour!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding chalets:', error);
        process.exit(1);
    }
}

seed();
