const { User } = require('../models/userModel');


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

};
