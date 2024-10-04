
 const jwt = require('jsonwebtoken');
const Manager = require('../models/managerModel'); 

const managerAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const manager = await Manager.findById(decoded._id); 

    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    req.manager = manager;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = managerAuth;

