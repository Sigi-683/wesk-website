const { Chalet, User } = require('../models');

exports.getAllChalets = async (req, res) => {
    try {
        const chalets = await Chalet.findAll({
            include: [{ model: User, attributes: ['id', 'email', 'cautionGiven', 'waiverGiven'] }]
        });
        console.log(`[API] getAllChalets found ${chalets.length} items`);
        res.json(chalets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chalets', error: error.message });
    }
};

exports.selectChalet = async (req, res) => {
    try {
        const chaletId = req.params.id;
        const userId = req.user.id;

        const chalet = await Chalet.findByPk(chaletId, {
            include: [{ model: User }]
        });
        if (!chalet) {
            return res.status(404).json({ message: 'Chalet not found' });
        }

        // Check if user already has a chalet?
        const user = await User.findByPk(userId);
        if (user.ChaletId) {
            return res.status(400).json({ message: 'You have already selected a chalet' });
        }

        // Check capacity
        if (chalet.Users && chalet.Users.length >= chalet.capacity) {
            return res.status(400).json({ message: 'Chalet is full' });
        }

        // Associate
        user.ChaletId = chaletId;
        await user.save();

        // Reload chalet to return updated state
        await chalet.reload({ include: [{ model: User }] });

        res.json({ message: 'Chalet selected successfully', chalet });
    } catch (error) {
        res.status(500).json({ message: 'Error selecting chalet', error: error.message });
    }
};

exports.unselectChalet = async (req, res) => {
    try {
        const chaletId = req.params.id;
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user.ChaletId) {
            return res.status(400).json({ message: 'You have not selected a chalet' });
        }

        // Ensure they are unselecting the correct chalet (optional, but good for consistency)
        if (user.ChaletId != chaletId) {
            return res.status(400).json({ message: 'You are not in this chalet' });
        }

        user.ChaletId = null;
        await user.save();

        const chalet = await Chalet.findByPk(chaletId, { include: [{ model: User }] });

        res.json({ message: 'Chalet unselected successfully', chalet });
    } catch (error) {
        res.status(500).json({ message: 'Error unselecting chalet', error: error.message });
    }
}

// Admin only
exports.createChalet = async (req, res) => {
    try {
        const chaletData = req.body;
        if (req.file) {
            // Store relative path or full URL. Relative is better if we serve static.
            // Using full URL assumption based on static serve: /uploads/filename
            // Assuming server is on same domain/port relative to API?
            // Actually let's just store '/uploads/filename'
            chaletData.imageUrl = `/uploads/${req.file.filename}`;
        }
        const chalet = await Chalet.create(chaletData);
        res.status(201).json(chalet);
    } catch (error) {
        res.status(500).json({ message: 'Error creating chalet', error: error.message });
    }
};

exports.updateChalet = async (req, res) => {
    try {
        const chalet = await Chalet.findByPk(req.params.id);
        if (!chalet) {
            return res.status(404).json({ message: 'Chalet not found' });
        }
        await chalet.update(req.body);
        res.json(chalet);
    } catch (error) {
        res.status(500).json({ message: 'Error updating chalet', error: error.message });
    }
};

exports.deleteChalet = async (req, res) => {
    try {
        const chalet = await Chalet.findByPk(req.params.id);
        if (!chalet) {
            return res.status(404).json({ message: 'Chalet not found' });
        }
        // Manually unlink users first to ensure consistency even if DB constraints fail or lag
        await User.update({ ChaletId: null }, { where: { ChaletId: req.params.id } });

        await chalet.destroy();
        res.json({ message: 'Chalet deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting chalet', error: error.message });
    }
};
