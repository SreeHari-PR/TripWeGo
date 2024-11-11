// src/routes/admin.js

const express = require('express');
const adminController = require('../controllers/adminController');
const categoryController=require('../controllers/categoryController')
const authMiddleware=require('../middlewares/authMiddleware')
const serviceController=require('../controllers/serviceController')
const managerController=require('../controllers/managerController')
const hotelController=require('../controllers/hotelController')
const bookingController=require('../controllers/bookingController')
const router = express.Router();



router.post('/login', adminController.login);
router.get('/users',authMiddleware, adminController.listUsers);
router.get('/managers',authMiddleware, adminController.listManagers);
router.get('/managers/:id', adminController.getManagerDetails);
router.get('/managers', adminController.getManagers);
router.post('/managers/block', managerController.blockManager);
router.post('/managers/unblock', managerController.unblockManager);
router.post('/managers/:id/approve', adminController.approveManager);
router.post('/users/:id/block', adminController.blockUser);
router.post('/users/:id/unblock', adminController.unblockUser);

router.get('/wallet-transactions',adminController.getAdminWallet);

//category controller

router.post('/add-category', categoryController.addCategory);
router.get('/categories', categoryController.getCategories);
router.delete('/delete-category/:id', categoryController.deleteCategory);

//service 
router.post('/add-service', serviceController.createService);
router.get('/services', serviceController.getAllServices);

//hotels 

router.get('/hotels',hotelController.listAllHotels)

//bookings
router.get('/bookings', bookingController.getBookings);

module.exports = router;
