const jwt = require('jsonwebtoken');
const asyncWrapper = require('../utils/asyncWrapper');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  const { JWT_SECRET } = process.env;
  const authHeader = req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Invalid authorization header');
    error.status = 401;
    return next(error);
  }
  const token = authHeader.split(' ')[1];
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }

  const user = User.findOne({ _id: payload.userId });
  const [userErr, userData] = await asyncWrapper(user);
  if (userErr) {
    if (!userErr.statusCode) {
      userErr.statusCode = 500;
      return next(userErr);
    }
  }
  if (!userData) {
    const error = new Error('Unauthenticated');
    error.status = 401;
    return next(error);
  }
  req.userId = userData._id;
  next();
};
