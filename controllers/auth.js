const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('../utils/cloudinary');
const User = require('../models/user');

exports.login = async (req, res, next) => {
  const {
    body: { email, password },
  } = req;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    const isValidPass = await user.verifyPassword(password);
    if (!isValidPass) {
      const error = new Error('Invalid password');
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '15d',
      }
    );

    res.status(200).json({ message: 'Login Successfully!', token, user });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  const {
    body: { firstName, lastName, email, password, role },
  } = req;

  if (!req.file) {
    const error = new Error('No image file provided');
    error.status = 422;
    return next(error);
  }

  try {
    const image = await cloudinary.uploader.upload(req.file.path);
    const imageUrl = image.secure_url;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstName,
      lastName,
      email,
      imageUrl,
      role,
      password: hashedPassword,
    });

    const newUser = await user.save();
    if (!newUser) {
      const error = new Error('User was not created');
      error.status = 500;
      throw error;
    }
    res.status(201).json({ message: 'User Created Successfully!', userId: newUser._id });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    return next(error);
  }
};
