const multer = require('multer');
const path = require('path');

// Storage for license and KYC
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer configuration for license and KYC
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

// Multer configuration for profile picture
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile_pictures/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const profileUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 1024 * 1024 * 2 }, // Limit profile picture size to 2MB
});

// Accept multiple files for license and KYC
const multipleUpload = upload.fields([
  { name: 'license', maxCount: 1 },
  { name: 'kyc', maxCount: 1 }
]);

// Middleware for profile picture upload
const profilePictureUpload = profileUpload.single('profilePicture');

module.exports = {
  multipleUpload,
  profilePictureUpload
};
