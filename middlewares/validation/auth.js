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
    .invalid(
      'password',
      '12345678',
      'adminadmin',
      '87654321',
      'password123',
      'iloveyou',
      '00000000'
    )
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
