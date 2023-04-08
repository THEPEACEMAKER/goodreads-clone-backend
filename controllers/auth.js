const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncWrapper = require('../utils/asyncWrapper');

exports.login = async (req, res, next) => {
  const {
    body: { email, password },
  } = req;

  const user = User.findOne({ email });
  const [userErr, userData] = await asyncWrapper(user);
  if (userErr) {
    if (!userErr.statusCode) {
      userErr.statusCode = 403;
    }
    return next(userErr);
  }
  if (!userData) {
    const error = new Error('User not found');
    error.statusCode = 404;
    return next(error);
  }

  const isValidPass = userData.verifyPassword(password);
  const [isValidErr, isValidData] = await asyncWrapper(isValidPass);
  if (isValidErr) {
    if (!isValidErr.statusCode) {
      isValidErr.statusCode = 500;
    }
    return next(isValidErr);
  }
  if (!isValidData) {
    const error = new Error('Invalid password');
    error.statusCode = 401;
    return next(error);
  }

  const token = jwt.sign(
    {
      email: userData.email,
      userId: userData._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '15d',
    }
  );

  res.status(200).json({ message: 'Login Successfully!', token: token, user: userData });
};

exports.signup = async (req, res, next) => {
  const {
    body: { firstName, lastName, email, password, role },
  } = req;

  if (!req.file) {
    const error = new Error('No image file provided');
    error.statusCode = 422;
    return next(error);
  }
  const imageUrl = `http://localhost:3000/images/${req.file.filename}`;

  const hashedPassword = bcrypt.hash(password, 12);
  const [hashedPasswordErr, hashedPasswordData] = await asyncWrapper(hashedPassword);
  if (hashedPasswordErr) {
    if (!hashedPasswordErr.statusCode) {
      hashedPasswordErr.statusCode = 500;
    }
    return next(hashedPasswordErr);
  }

  const user = new User({
    firstName,
    lastName,
    email,
    imageUrl,
    role,
    password: hashedPasswordData,
  });

  const newUser = user.save();
  const [newUserErr, newUserData] = await asyncWrapper(newUser);
  if (newUserErr) {
    if (!newUserErr.statusCode) {
      newUserErr.statusCode = 500;
    }
    return next(newUserErr);
  }

  if (!newUserData) {
    const error = new Error('User was not created');
    error.statusCode = 500;
    return next(error);
  }
  res.status(201).json({ message: 'User Created Successfully!', userId: newUserData._id });
};
