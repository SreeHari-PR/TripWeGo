
require('dotenv').config();
const bcrypt = require('bcrypt');
const { findUserById, findUserByEmail, createUser, updateUserPassword, updateUserProfile,updateUserProfilePicture,updatePassword,getUserById } = require('../repositories/userRepository');
const { validate } = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
const generateOtp = require('../utils/generateOtp')
const pendingUsers = new Map();
const pendingPasswordResets = new Map();

const registerUser = async (userData) => {
    const { error } = validate(userData);
    if (error) {
        throw new Error(error.details[0].message);
    }

    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
        throw new Error('Email already exists');
    }

    const otp = generateOtp();
    console.log(otp, 'userotp');
    pendingUsers.set(userData.email, { ...userData, otp });


    await sendEmail(userData.email, 'Your OTP Code', `Your OTP code is ${otp}. Please enter this code to verify your email.`);

    return { message: 'User registered successfully. Please verify your OTP.' };
};
const verifyOtp = async (email, otp) => {

    const userData = pendingUsers.get(email);
    if (!userData) {
        throw new Error('OTP expired or user not found');
    }

    if (userData.otp !== otp) {
        throw new Error('Invalid OTP');
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = {
        ...userData,
        password: hashedPassword,
        verified: true,
    };

    const user = await createUser(newUser);
    pendingUsers.delete(email);

    return { message: 'User verified and registered successfully.', user };
};
const resendOtp = async (email) => {
    const userData = pendingUsers.get(email);

    if (!userData) {
        throw new Error('OTP expired or user not found');
    }

    const newOtp = generateOtp();
    userData.otp = newOtp;
    console.log(newOtp, 'newotp');

    await sendEmail(email, 'Your New OTP Code', `Your new OTP code is ${newOtp}. Please enter this code to verify your email.`);

    return { message: 'New OTP sent successfully. Please check your email.' };
};



const loginUser = async (email, password) => {
    const user = await findUserByEmail(email);
    console.log(user, 'user');

    if (!user) {
        throw new Error('Invalid email or password');
    }

    
    if (user.isBlocked===true) {
        throw new Error('Your account has been blocked. Please contact support.');
    }

   
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new Error('Invalid email or password');
    }

    
    if (!user.verified) {
        throw new Error('Your email is not verified. Please verify your email using the OTP sent to you.');
    }

    
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();
    

        user.refreshToken = refreshToken;
        await user.save();


    return { 
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isBlocked: user.isBlocked,
            verified: user.verified,
        }
    };
};



const getUserProfile = async (userId) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
const blockUser = async (userId) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new Error('User not found')
    }
    if (user.isBlocked) {
        throw new Error('User already Blocked')
    }
    user.isBlocked = true;
    await user.save();
    return user
};
const unblockUser = async (userId) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (!user.isBlocked) {
        throw new Error('User is not blocked');
    }

    user.isBlocked = false;
    await user.save();

    return user;
};
const forgotPasswordService = async (email) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error('Email does not exist');
    }

    const otp = generateOtp();
    console.log(otp, 'forgotpass');

    pendingPasswordResets.set(email, otp);

    // Send OTP to the user's email
    await sendEmail(email, 'Reset Password OTP', `Your OTP for resetting your password is: ${otp}`);
    return { message: 'OTP sent to your email for password reset.' };
};

const verifyOtpForPasswordReset = async (email, otp) => {
    const storedOtp = pendingPasswordResets.get(email);
    console.log(storedOtp, 'jkjk');

    if (!storedOtp || storedOtp !== otp) {
        throw new Error('Invalid or expired OTP');
    }

    return { message: 'OTP verified, proceed to reset your password.' };
};

const resetPassword = async (email, newPassword) => {
    const storedOtp = pendingPasswordResets.get(email);
    if (!storedOtp) {
        throw new Error('OTP expired or not verified');
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await updateUserPassword(email, hashedPassword);
    pendingPasswordResets.delete(email);

    return { message: 'Password reset successful.' };
};
const editUserProfile = async (userId, updatedData) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const updatedUser = await updateUserProfile(userId, updatedData);
    return updatedUser;
};
const handleProfilePictureUpload = async (userId, profilePicturePath) => {
    try {
        
        const updatedUser = await updateUserProfilePicture(userId, profilePicturePath);

        if (!updatedUser) {
            throw new Error('User not found');
        }

        return updatedUser;
    } catch (error) {
        throw new Error('Service error: ' + error.message);
    }
};
   const forgotPassword=async (userId, currentPassword, newPassword) =>{
    const user = await findUserById(userId);
    console.log(user,'userdetails');
    

    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    console.log(isPasswordMatch,'passwordmatch');
    

    if (!isPasswordMatch) {
      throw new Error('Current password is incorrect');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await  updatePassword(userId, hashedPassword);

    return { message: 'Password updated successfully' };
  }





module.exports = {
    registerUser,
    loginUser,
    verifyOtp,
    resendOtp,
    getUserProfile,
    blockUser,
    unblockUser,
    forgotPasswordService,
    verifyOtpForPasswordReset,
    resetPassword,
    editUserProfile,
    handleProfilePictureUpload,
    forgotPassword,
};
