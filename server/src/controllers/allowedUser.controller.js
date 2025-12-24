const { AllowedUser } = require('../models');

exports.getAll = async (req, res) => {
    try {
        const allowedUsers = await AllowedUser.findAll();
        res.json(allowedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching allowed users', error: error.message });
    }
};

exports.add = async (req, res) => {
    try {
        const { email, firstName, lastName, ticketType } = req.body;
        const newUser = await AllowedUser.create({ email, firstName, lastName, ticketType });
        res.status(201).json(newUser);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email already in whitelist' });
        }
        res.status(500).json({ message: 'Error adding user', error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await AllowedUser.destroy({ where: { id } });
        res.json({ message: 'User removed from whitelist' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

exports.importCsv = async (req, res) => {
    try {
        const { csvContent } = req.body;
        if (!csvContent) {
            return res.status(400).json({ message: 'No CSV content provided' });
        }

        const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');
        let addedCount = 0;
        let skippedCount = 0;

        for (const line of lines) {
            const email = line.trim();
            // Basic validation
            if (!email.includes('@')) {
                skippedCount++;
                continue;
            }

            try {
                await AllowedUser.findOrCreate({ where: { email } });
                addedCount++;
            } catch (err) {
                skippedCount++;
            }
        }

        res.json({ message: 'Import completed', added: addedCount, skipped: skippedCount });
    } catch (error) {
        res.status(500).json({ message: 'Error importing CSV', error: error.message });
    }
};
