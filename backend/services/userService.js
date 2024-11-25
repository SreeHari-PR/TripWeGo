require('dotenv').config();
const bcrypt = require('bcrypt');
const {
    findUserById,
    findUserByEmail,
    createUser,
    updateUserPassword,
    updateUserProfile,
    updateUserProfilePicture,
    updatePassword,
} = require('../repositories/userRepository');
const { validate } = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
const generateOtp = require('../utils/generateOtp');
const pendingUsers = new Map();
const pendingPasswordResets = new Map();

const registerUser = async (userData) => {
    try {
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
    } catch (error) {
        throw new Error('Error during user registration: ' + error.message);
    }
};

const verifyOtp = async (email, otp) => {
    try {
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
    } catch (error) {
        throw new Error('Error verifying OTP: ' + error.message);
    }
};

const resendOtp = async (email) => {
    try {
        const userData = pendingUsers.get(email);
        if (!userData) {
            throw new Error('OTP expired or user not found');
        }

        const newOtp = generateOtp();
        userData.otp = newOtp;
        console.log(newOtp, 'newotp');

        await sendEmail(email, 'Your New OTP Code', `Your new OTP code is ${newOtp}. Please enter this code to verify your email.`);

        return { message: 'New OTP sent successfully. Please check your email.' };
    } catch (error) {
        throw new Error('Error resending OTP: ' + error.message);
    }
};

const loginUser = async (email, password) => {
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (user.isBlocked) {
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
            },
        };
    } catch (error) {
        throw new Error('Error logging in: ' + error.message);
    }
};

const getUserProfile = async (userId) => {
    try {
        const user = await findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error('Error fetching user profile: ' + error.message);
    }
};

const blockUser = async (userId) => {
    try {
        const user = await findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.isBlocked) {
            throw new Error('User already blocked');
        }
        user.isBlocked = true;
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Error blocking user: ' + error.message);
    }
};

const unblockUser = async (userId) => {
    try {
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
    } catch (error) {
        throw new Error('Error unblocking user: ' + error.message);
    }
};

const forgotPasswordService = async (email) => {
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            throw new Error('Email does not exist');
        }

        const otp = generateOtp();
        console.log(otp, 'forgotpass');

        pendingPasswordResets.set(email, otp);

        await sendEmail(email, 'Reset Password OTP', `Your OTP for resetting your password is: ${otp}`);
        return { message: 'OTP sent to your email for password reset.' };
    } catch (error) {
        throw new Error('Error sending forgot password OTP: ' + error.message);
    }
};

const verifyOtpForPasswordReset = async (email, otp) => {
    try {
        const storedOtp = pendingPasswordResets.get(email);
        if (!storedOtp || storedOtp !== otp) {
            throw new Error('Invalid or expired OTP');
        }
        return { message: 'OTP verified, proceed to reset your password.' };
    } catch (error) {
        throw new Error('Error verifying OTP for password reset: ' + error.message);
    }
};

const resetPassword = async (email, newPassword) => {
    try {
        const storedOtp = pendingPasswordResets.get(email);
        if (!storedOtp) {
            throw new Error('OTP expired or not verified');
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await updateUserPassword(email, hashedPassword);
        pendingPasswordResets.delete(email);

        return { message: 'Password reset successful.' };
    } catch (error) {
        throw new Error('Error resetting password: ' + error.message);
    }
};

const editUserProfile = async (userId, updatedData) => {
    try {
        const user = await findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const updatedUser = await updateUserProfile(userId, updatedData);
        return updatedUser;
    } catch (error) {
        throw new Error('Error editing user profile: ' + error.message);
    }
};

const handleProfilePictureUpload = async (userId, profilePicturePath) => {
    try {
        const updatedUser = await updateUserProfilePicture(userId, profilePicturePath);
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    } catch (error) {
        throw new Error('Error handling profile picture upload: ' + error.message);
    }
};

const forgotPassword = async (userId, currentPassword, newPassword) => {
    try {
        const user = await findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            throw new Error('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updatePassword(userId, hashedPassword);

        return { message: 'Password updated successfully' };
    } catch (error) {
        throw new Error('Error updating password: ' + error.message);
    }
};

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
