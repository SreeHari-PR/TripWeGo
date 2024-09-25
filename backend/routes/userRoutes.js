const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { googleLoginController } = require('../controllers/authController');
const {profilePictureUpload} = require('../middlewares/multer');



router.post('/google', googleLoginController);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/verify-otp', userController.verifyOtpHandler);
router.post('/resend-otp',userController.resendOtpHandler)
router.get('/profile', authMiddleware, userController.userProfile);
router.put('/:id/block',userController.blockUserController);
router.put('/:id/unblock',userController.unblockUserController);
router.post('/forgot-password', userController.forgotpassword);
router.post('/verify-otp-password-reset', userController.verifyOtpForPasswordResetHandler);
router.post('/reset-password', userController.resetPasswordHandler);
router.post('/resetpassword', authMiddleware, userController.userresetPassword);
router.put('/profile', authMiddleware, userController.editProfile);
router.post('/upload-profile-picture', authMiddleware, profilePictureUpload, userController.uploadProfilePictureHandler);
module.exports = router;
