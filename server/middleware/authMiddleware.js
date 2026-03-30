const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      const err = new Error('Not authorized, token failed');
      return next(err);
    }
  }

  if (!token) {
    res.status(401);
    const err = new Error('Not authorized, no token');
    return next(err);
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    next();
  } else {
    res.status(401);
    const error = new Error('Not authorized as an admin');
    next(error);
  }
};

module.exports = { protect, admin };
