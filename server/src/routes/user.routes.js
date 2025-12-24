const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken: auth } = require('../middleware/auth.middleware');

router.get('/', auth, userController.getAllUsers);
router.put('/:id', auth, userController.updateUserStatus);

module.exports = router;
