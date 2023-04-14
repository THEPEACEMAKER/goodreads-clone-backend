const Joi = require('joi');

const signupSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .min(3)
    .max(15)
    .required()
    .trim(),
  lastName: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .min(3)
    .max(15)
    .required()
    .trim(),
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ['com', 'net', 'org', 'edu', 'gov'],
      },
    })
    .lowercase()
    .required()
    .max(254),
  password: Joi.string()
    .min(8)
    .trim()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .invalid('password', '12345678', 'adminadmin', '87654321', 'password123', 'iloveyou')
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
      'string.min': 'Password must be at least {#limit} characters long',
      'any.invalid': 'Password is too common',
    }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords must match',
  }),
  image: Joi.binary()
    .encoding('base64')
    .max(5 * 1024 * 1024),
  role: Joi.string().valid('USER', 'ADMIN').default('USER'),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ['com', 'net', 'org', 'edu', 'gov'],
      },
    })
    .lowercase()
    .required()
    .max(254),
  password: Joi.string()
    .min(8)
    .trim()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .invalid('password', '12345678', 'adminadmin', '87654321', 'password123', 'iloveyou')
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
      'string.min': 'Password must be at least {#limit} characters long',
      'any.invalid': 'Password is too common',
    }),
});

const authorSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .min(3)
    .max(15)
    .required()
    .trim(),
  lastName: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .min(3)
    .max(15)
    .required()
    .trim(),
  dob: Joi.date().required().max('2005-12-31').iso(),
  image: Joi.binary()
    .encoding('base64')
    .max(5 * 1024 * 1024),
});

const categorySchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .min(3)
    .max(15)
    .required()
    .trim(),
});

const bookSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .min(3)
    .max(100)
    .required()
    .trim(),
  description: Joi.string().min(10).required().trim(),
  image: Joi.binary()
    .encoding('base64')
    .max(5 * 1024 * 1024),
  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .trim()
    .required(),
  author: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .trim()
    .required(),
  avgRating: Joi.number().min(0).max(5).precision(1),
  reviews: Joi.array().items(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .trim()
  ),
});

const ratingSchema = Joi.object({
  rate: Joi.number().min(0).max(5).required(),
});

const reviewSchema = Joi.object({
  title: Joi.string().alphanum().min(3).max(100).required().trim(),
  content: Joi.string().min(3).required().trim(),
  user: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .trim()
    .required(),
  book: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .trim()
    .required(),
});

const shelfSchema = Joi.object({
  bookId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .trim()
    .required(),
  shelf: Joi.string().valid('WANT_TO_READ', 'CURRENTLY_READING', 'READ', 'NONE').required(),
});

exports.validateSignup = (req, res, next) => {
  const { error, data } = signupSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};

exports.validateLogin = (req, res, next) => {
  const { error, data } = loginSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};

exports.validateAuthorData = (req, res, next) => {
  const { error, data } = authorSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};

exports.validateCategoryData = (req, res, next) => {
  const { error, data } = categorySchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};

exports.validateBookData = (req, res, next) => {
  const { error, data } = bookSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};

exports.validateRatingData = (req, res, next) => {
  const { error, data } = ratingSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};

exports.validateReviewData = (req, res, next) => {
  const { error, data } = reviewSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};

exports.validateShelfData = (req, res, next) => {
  const { error, data } = shelfSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};
