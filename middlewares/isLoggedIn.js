const jwt = require('jsonwebtoken');
const asyncWrapper = require('../utils/asyncWrapper');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  const { JWT_SECRET } = process.env;
  const authHeader = req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // user is not signed in
    return next();
  }
  const token = authHeader.split(' ')[1];
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // token is invalid or expired, user is not signed in
    return next();
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
    // user is not signed in
    return next();
  }
  req.user = userData;
  next();
};
