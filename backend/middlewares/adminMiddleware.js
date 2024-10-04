require('dotenv');

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const adminAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Access denied, only admins are allowed' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = adminAuthMiddleware;

