const express = require('express');
const router = express.Router();
const allowedUserController = require('../controllers/allowedUser.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.get('/', verifyToken, isAdmin, allowedUserController.getAll);
router.post('/', verifyToken, isAdmin, allowedUserController.add);
router.delete('/:id', verifyToken, isAdmin, allowedUserController.delete);
router.post('/import', verifyToken, isAdmin, allowedUserController.importCsv);

module.exports = router;
