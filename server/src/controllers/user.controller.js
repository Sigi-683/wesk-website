const { User } = require('../models');

// Admin: Get all users
exports.getAllUsers = async (req, res) => {
    try {
        if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        console.log(`[API] getAllUsers found ${users.length} items`);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Admin: Toggle user flags
exports.updateUserStatus = async (req, res) => {
    try {
        if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
        const { id } = req.params;
        const { cautionGiven, waiverGiven, ChaletId } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (cautionGiven !== undefined) user.cautionGiven = cautionGiven;
        if (waiverGiven !== undefined) user.waiverGiven = waiverGiven;
        if (ChaletId !== undefined) user.ChaletId = ChaletId;

        await user.save();
        res.json({ message: 'User updated', user: { id: user.id, email: user.email, cautionGiven: user.cautionGiven, waiverGiven: user.waiverGiven } });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};
