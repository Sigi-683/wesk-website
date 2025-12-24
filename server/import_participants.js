const fs = require('fs');
const path = require('path');
const { sequelize, AllowedUser } = require('./src/models');

async function importParticipants(filePath) {
    if (!filePath) {
        console.error('Please provide the path to the CSV file.');
        process.exit(1);
    }

    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync models to ensure table exists
        await sequelize.sync();

        const absolutePath = path.resolve(filePath);
        if (!fs.existsSync(absolutePath)) {
            console.error(`File not found: ${absolutePath}`);
            process.exit(1);
        }

        const content = fs.readFileSync(absolutePath, 'utf-8');
        const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');

        let addedCount = 0;
        let skippedCount = 0;

        console.log(`Found ${lines.length} emails to process.`);

        for (const line of lines) {
            const email = line.trim();
            // Basic email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                console.warn(`Invalid email format skipped: ${email}`);
                skippedCount++;
                continue;
            }

            try {
                await AllowedUser.findOrCreate({
                    where: { email: email }
                });
                addedCount++;
            } catch (err) {
                console.error(`Error adding ${email}:`, err.message);
                skippedCount++;
            }
        }

        console.log('Import completed.');
        console.log(`Added/Verified: ${addedCount}`);
        console.log(`Skipped/Errors: ${skippedCount}`);

    } catch (error) {
        console.error('Database connection failed:', error);
    } finally {
        await sequelize.close();
    }
}

const args = process.argv.slice(2);
importParticipants(args[0]);
