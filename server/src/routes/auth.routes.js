const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

const { verifyToken: auth } = require('../middleware/auth.middleware');
const { check } = require('express-validator');

const registerValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
];

const loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/change-password', auth, authController.changePassword);
router.get('/me', auth, authController.getMe);

module.exports = router;
