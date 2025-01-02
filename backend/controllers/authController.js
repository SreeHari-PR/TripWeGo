require('dotenv').config();
const { verifyGoogleToken } = require('../services/googleAuthService');
const { findUserByEmail, createUser } = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const HttpStatusCodes=require('../utils/httpStatusCodes')

const generateRandomPassword = () => {
    return crypto.randomBytes(16).toString('hex');
};

const googleLoginController = async (req, res) => {
    const { token } = req.body;

    try {
        const { email, name } = await verifyGoogleToken(token);
        let user = await findUserByEmail(email);
        if (!user) {
            const randomPassword = generateRandomPassword();
            user = await createUser({
                email,
                name,
                password: randomPassword,
                verified: true,
            });
        }
        const jwtToken =jwt.sign({ _id: user._id, email: user.email }, process.env.JWTSECRETKEY, {
            expiresIn: '1h',
        });

        return res.status(HttpStatusCodes.OK).json({
            user: {
                email: user.email,
                name: user.name,
            },
            token: jwtToken,
        });
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

module.exports = { googleLoginController };
