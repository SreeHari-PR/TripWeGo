const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const bookingController = require('../controllers/bookingController');
const hotelController = require('../controllers/hotelController');
const chatController=require('../controllers/chatController')
const authMiddleware = require('../middlewares/authMiddleware');

// Manager Management
router.post('/register', managerController.registerManager); 
router.post('/approve', managerController.approveManager); 
router.post('/manager-otp', managerController.verifyManagerOtp); 
router.post('/resend-otp', managerController.resendManagerOtp); 
router.post('/login', managerController.loginManager);
router.get('/manager-profile', authMiddleware, managerController.getManagerProfile);
router.post('/profile-image', authMiddleware, managerController.updateProfileImage);
router.put('/edit-profile', authMiddleware, managerController.editManagerProfile);

// Hotel Management
router.post('/add-hotel/:id', authMiddleware, hotelController.addHotel);
router.get('/hotels', authMiddleware, hotelController.listHotelsByManager);
router.get('/hotels/:id', authMiddleware, hotelController.getHotel);
router.put('/hotels/edit/:id', authMiddleware, hotelController.editHotel);
router.put('/hotels/:id/list', authMiddleware, hotelController.listHotel);
router.put('/hotels/:id/unlist', authMiddleware, hotelController.unlistHotel);

// Booking Management
router.get('/bookings/:managerId', authMiddleware, bookingController.listManagerBookings);

// Wallet Management
router.get('/wallet-transactions/:managerId', authMiddleware, managerController.getManagerWalletAndTransactions);


//chat


router.post('/send', authMiddleware, chatController.sendMessage);
router.get('/rooms', authMiddleware, chatController.getChatRooms);
router.get('/chats/:bookingId', authMiddleware, chatController.getMessages);


module.exports = router;



