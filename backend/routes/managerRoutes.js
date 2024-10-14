const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const hotelController=require('../controllers/hotelController')
const managerAuth = require('../middlewares/managerAuth'); 
const authMiddleware=require('../middlewares/adminMiddleware')
const {multipleUpload} = require('../middlewares/multer');


router.post('/register', managerController.registerManager);
router.post('/approve', managerController.approveManager); 
router.post('/manager-otp', managerController.verifyManagerOtp);
router.post('/resend-otp', managerController.resendManagerOtp);
router.post('/login', managerController.loginManager);
router.get('/manager-profile', managerController.getManagerProfile);
router.post('/profile-image', managerController.updateProfileImage);

router.put('/edit-profile', managerController.editManagerProfile);

//hotels
router.post('/add-hotel/:id', hotelController.addHotel);
router.get('/hotels', hotelController.listHotelsByManager);


module.exports = router;
