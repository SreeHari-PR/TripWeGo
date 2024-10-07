const { registerUser, loginUser, verifyOtp,resendOtp,getUserProfile,blockUser,unblockUser,forgotPassword,  } = require('../services/userService');
const { forgotPasswordService, verifyOtpForPasswordReset, resetPassword,editUserProfile,handleProfilePictureUpload   } = require('../services/userService');
const register = async (req, res) => {
    try {
        await registerUser(req.body);
        res.status(201).send({ message: 'Otp sent to mail' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const {token,user} = await loginUser(req.body.email, req.body.password);
        res.status(200).send({ message: 'Login successful', token,user });
    } catch (error) {
        res.status(401).send({ message: error.message });
    }
};

const verifyOtpHandler = async (req, res) => {
    try {
        const {email, otp } = req.body; 
        const user = await verifyOtp( email,otp);
        res.send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
};
const resendOtpHandler=async(req,res)=>{
    try {
        console.log('gsdghjgdgj');
        
        const { email } = req.body;
        const result = await resendOtp(email);
        console.log(result,'hdjkhakhs');
        
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }

};
const userProfile = async (req, res) => {
    try {
        const user = await getUserProfile(req.user._id); 
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};
const blockUserController = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await blockUser(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User has been blocked', user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const unblockUserController = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await unblockUser(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User has been unblocked', user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const forgotpassword=async(req,res)=>{
    try {
        const {email}=req.body;
        const result=await forgotPasswordService(email);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send({message:error.message});
    }
}
const verifyOtpForPasswordResetHandler = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await verifyOtpForPasswordReset(email, otp);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};
const resetPasswordHandler = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const result = await resetPassword(email, newPassword);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};
const editProfile = async (req, res) => {
    try {
        const updatedUser = await editUserProfile(req.user._id, req.body); 
        res.status(200).send({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};
const uploadProfilePictureHandler = async (req, res) => {
    try {
        const userId = req.user.id;  
        const profilePicturePath = req.file.path;

        
        const updatedUser = await handleProfilePictureUpload(userId, profilePicturePath);

        res.status(200).json({
            message: 'Profile picture uploaded successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 const userresetPassword=  async (req, res) =>{
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id; 
    console.log(req.body,'passwords');
    console.log(userId,'userid');
   try {
      const result = await forgotPassword(userId, currentPassword, newPassword);
      console.log(result,'jhsgd');
      
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }


module.exports = {
    register,
    login,
    verifyOtpHandler,
    resendOtpHandler,
    userProfile,
    blockUserController,
    unblockUserController,
    forgotpassword ,
    verifyOtpForPasswordResetHandler,
    resetPasswordHandler,
    editProfile,
    uploadProfilePictureHandler,
    userresetPassword,
    
};
