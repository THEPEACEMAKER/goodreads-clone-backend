const Joi = require('joi');

const addAuthorSchema = Joi.object({
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

const updateAuthorSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .min(3)
    .max(15)
    .trim(),
  lastName: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .min(3)
    .max(15)
    .trim(),
  dob: Joi.date().max('2005-12-31').iso(),
  image: Joi.binary()
    .encoding('base64')
    .max(5 * 1024 * 1024),
});

exports.validateAddAuthorData = (req, res, next) => {
  const { error, data } = addAuthorSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};

exports.validateUpdateAuthorData = (req, res, next) => {
  const { error, data } = updateAuthorSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};
