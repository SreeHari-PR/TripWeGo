// src/routes/admin.js

const express = require('express');
const adminController = require('../controllers/adminController');
const categoryController=require('../controllers/categoryController')
const adminAuthMiddleware=require('../middlewares/adminMiddleware')
const serviceController=require('../controllers/serviceController')
const router = express.Router();



router.post('/login', adminController.login);
router.get('/users', adminController.listUsers);
router.get('/managers', adminController.listManagers);
router.get('/managers/:id', adminController.getManagerDetails);
router.post('/managers/:id/approve', adminController.approveManager);
router.post('/users/:id/block', adminController.blockUser);
router.post('/users/:id/unblock', adminController.unblockUser);

//category controller

router.post('/add-category', categoryController.addCategory);
router.get('/categories', categoryController.getCategories);
router.delete('/delete-category/:id', categoryController.deleteCategory);

//service 
router.post('/add-service', serviceController.createService);
router.get('/services', serviceController.getAllServices);

module.exports = router;
