const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { googleLoginController } = require('../controllers/authController');
const paymentcontroller = require('../controllers/paymentController')
const hotelController = require('../controllers/hotelController');
const bookingController = require('../controllers/bookingController');
const walletController = require('../controllers/walletController')
const categoryController = require('../controllers/categoryController')
const OlaMapsController = require('../controllers/OlaMapsContoller');
const refreshMiddleware = require('../middlewares/refreshMiddleware');

const chatController = require('../controllers/chatController');



router.post('/google', googleLoginController);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/verify-otp', userController.verifyOtpHandler);
router.post('/resend-otp', userController.resendOtpHandler)
router.get('/profile', authMiddleware, userController.userProfile);
router.put('/:id/block', userController.blockUserController);
router.put('/:id/unblock', userController.unblockUserController);
router.post('/forgot-password', userController.forgotpassword);
router.post('/verify-otp-password-reset', userController.verifyOtpForPasswordResetHandler);
router.post('/reset-password', userController.resetPasswordHandler);
router.post('/resetpassword', authMiddleware, userController.userresetPassword);
router.put('/profile', authMiddleware, userController.editProfile);
router.post('/upload-profile-picture', authMiddleware, userController.uploadProfilePictureHandler);


//refreshToken
router.post('/users/refresh-token', refreshMiddleware);

//hotels
router.get('/hotels', hotelController.listAllHotels);
router.get('/search', hotelController.searchHotels);
router.get('/hotels/:id', hotelController.getHotel);
router.get('/categories', categoryController.getCategories);
router.post('/hotels/:hotelId/addreviews', authMiddleware, hotelController.addReview);
router.get('/hotels/:hotelId/reviews', authMiddleware, hotelController.getHotelReviews);

//bookings


router.post('/create-order', paymentcontroller.createOrder);


router.post('/verify-payment', authMiddleware, paymentcontroller.verifyPayment);

router.get('/bookings', authMiddleware, bookingController.listUserBookings);
router.delete('/bookings/:bookingId/cancel', authMiddleware, bookingController.cancelBooking);
router.get('/bookings/:bookingId/manager',authMiddleware, bookingController.getManagerByBooking);


// Routes for wallet operations
router.get('/wallet/balance', authMiddleware, walletController.getBalance);
router.post('/wallet/add-funds', authMiddleware, walletController.addFunds);
router.post('/wallet/deduct-funds', authMiddleware, walletController.deductFunds);


//maps
router.get('/autocomplete', OlaMapsController.autocomplete);

//chats


router.post('/message', authMiddleware, chatController.sendMessage.bind(chatController));
router.get('/messages/:bookingId', authMiddleware, chatController.getMessages.bind(chatController));
router.get('/chats', authMiddleware, chatController.getChatRooms.bind(chatController))





module.exports = router;
