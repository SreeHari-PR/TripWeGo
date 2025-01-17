const { User } = require('../models/userModel');
const Transaction = require('../models/transactionModel');

const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};
const createUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};
const findUserById = async (id) => {
    return await User.findById({_id:id});
};

const updateUserVerifiedStatus = async (id, verified) => {
    return await User.findByIdAndUpdate({_id:id}, { verified }, { new: true });
};
const getAllUsers=async()=>{
    return await User.find({}, { password: 0, tokens: 0 });
};
const blockUser = async (id) => {
    return await User.findByIdAndUpdate({ _id: id }, { isBlocked: true }, { new: true });
};

const unblockUser = async (id) => {
    return await User.findByIdAndUpdate({ _id: id }, { isBlocked: false }, { new: true });
};
const updateUserPassword = async (email, newPassword) => {
    return await User.findOneAndUpdate({ email }, { password: newPassword }, { new: true });
};
const updatePassword= async(userId, hashedPassword)=> {
    return await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
  }
const updateUserProfile = async (userId, updatedData) => {
    return await User.findByIdAndUpdate(userId, updatedData, { new: true });
};
const updateUserProfilePicture = async (userId, profilePicturePath) => {
    try {
        return await User.findByIdAndUpdate(
            userId,
            { profilePicture: profilePicturePath },
            { new: true }
        );
    } catch (error) {
        throw new Error('Database error: Unable to update profile picture');
    }
};
const deductBalance = async (userId, amount, description = 'Balance deducted') => {
    try {
        console.log(userId, 'Initiating userId');
        console.log(amount, 'Deduction amount');

       
        const adminUser = await User.findOne({ isAdmin: true });
        if (!adminUser) {
            throw new Error('Admin user not found');
        }

        const updatedAdmin = await User.findByIdAndUpdate(
            adminUser._id, 
            { $inc: { walletBalance: -amount } }, 
            { new: true } 
        );

        if (!updatedAdmin) {
            throw new Error('Failed to update admin balance');
        }

      
        const transaction = new Transaction({
            userId: adminUser._id, 
            amount,
            type: 'debit',
            description,
        });

        await transaction.save(); 

        return {
            updatedAdmin,
            transaction,
        };
    } catch (error) {
        console.error('Error in deducting balance:', error.message);
        throw new Error(error.message || 'Error deducting balance');
    }
};
const addBalance = async (userId, amount) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { walletBalance: amount } },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error('User not found or insufficient permissions');
        }

        return updatedUser;
    } catch (error) {
        console.error('Error in adding balance to user:', error.message);
        throw new Error('Error adding balance to user');
    }
};



module.exports = {
    findUserById,
    updateUserVerifiedStatus,
    findUserByEmail,
    createUser,
    getAllUsers,
    blockUser,     
    unblockUser,
    updateUserPassword,
    updateUserProfile, 
    updateUserProfilePicture,
    updatePassword,
    deductBalance,
    addBalance,

};
