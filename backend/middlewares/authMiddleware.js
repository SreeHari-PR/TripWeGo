// src/middlewares/authMiddleware.js

require('dotenv').config();
const jwt = require('jsonwebtoken');
const findUserById = require('../repositories/userRepository').findUserById;

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
    const user = await findUserById(decoded._id); 
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isBlocked===true) {
      return res.status(403).json({ message: 'Your account is blocked. Please contact support.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
