// src/routes/admin.js

const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();



router.post('/login', adminController.login);
router.get('/users', adminController.listUsers);
router.get('/managers', adminController.listManagers);
router.get('/managers/:id', adminController.getManagerDetails);
router.post('/managers/:id/approve', adminController.approveManager);
router.post('/users/:id/block', adminController.blockUser);
router.post('/users/:id/unblock', adminController.unblockUser);

module.exports = router;
