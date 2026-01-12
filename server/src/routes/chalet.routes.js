const express = require('express');
const router = express.Router();
const chaletController = require('../controllers/chalet.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public/User routes
router.get('/', chaletController.getAllChalets);
router.post('/:id/select', verifyToken, chaletController.selectChalet);
router.post('/:id/unselect', verifyToken, chaletController.unselectChalet);

// Admin routes
router.post('/', [verifyToken, isAdmin, upload.single('image')], chaletController.createChalet);
router.put('/:id', [verifyToken, isAdmin, upload.single('image')], chaletController.updateChalet);
router.delete('/:id', [verifyToken, isAdmin], chaletController.deleteChalet);

module.exports = router;
