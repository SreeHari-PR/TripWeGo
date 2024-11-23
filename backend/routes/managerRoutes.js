// const express = require('express');
// const router = express.Router();
// const managerController = require('../controllers/managerController');
// const bookingController=require('../controllers/bookingController')
// const hotelController=require('../controllers/hotelController')
// const authMiddleware=require('../middlewares/adminMiddleware')



// router.post('/register', managerController.registerManager);
// router.post('/approve', managerController.approveManager); 
// router.post('/manager-otp', managerController.verifyManagerOtp);
// router.post('/resend-otp', managerController.resendManagerOtp);
// router.post('/login', managerController.loginManager);
// router.get('/manager-profile', managerController.getManagerProfile);
// router.post('/profile-image', managerController.updateProfileImage);

// router.put('/edit-profile', managerController.editManagerProfile);

// //hotels
// router.post('/add-hotel/:id', hotelController.addHotel);
// router.get('/hotels', hotelController.listHotelsByManager);
// router.get('/hotels/:id', hotelController.getHotel);
// router.put('/hotels/edit/:id', hotelController.editHotel); 
// router.put('/hotels/:id/list', hotelController.listHotel); 
// router.put('/hotels/:id/unlist', hotelController.unlistHotel);

// router.get('/bookings/:managerId',bookingController.listManagerBookings);

// router.get('/wallet-transactions/:managerId', managerController.getManagerWalletAndTransactions);


// module.exports = router;

const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const bookingController = require('../controllers/bookingController');
const hotelController = require('../controllers/hotelController');
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

module.exports = router;



