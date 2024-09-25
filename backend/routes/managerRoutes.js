const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const authMiddleware = require('../middlewares/authMiddleware'); 
const {multipleUpload} = require('../middlewares/multer');


router.post('/register',multipleUpload, managerController.registerManager);
router.post('/approve', authMiddleware, managerController.approveManager); 
router.post('/manager-otp', managerController.verifyManagerOtp);
router.post('/resend-otp', managerController.resendManagerOtp);
router.post('/login', managerController.loginManager);
router.get('/manager-profile', authMiddleware, managerController.getManagerProfile);
router.post('/block', authMiddleware, managerController.blockManager);
router.post('/unblock', authMiddleware, managerController.unblockManager);

module.exports = router;
