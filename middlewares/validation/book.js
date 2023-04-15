const Joi = require('joi');

const addBookSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z0-9\s\-\'\,\.\?\!]+$/)
    .min(3)
    .max(100)
    .required()
    .trim(),
  description: Joi.string().min(10).required().trim(),
  image: Joi.binary()
    .encoding('base64')
    .max(5 * 1024 * 1024),
  categoryId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .trim()
    .required(),
  authorId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .trim()
    .required(),
  avgRating: Joi.number().min(0).max(5).precision(1),
  ratingsCount: Joi.number().min(0),
  reviews: Joi.array().items(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .trim()
  ),
  shelfName: Joi.string().valid('WANT_TO_READ', 'CURRENTLY_READING', 'READ', 'NONE'),
});

const updateBookSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z0-9\s\-\'\,\.\?\!]+$/)
    .min(3)
    .max(100)
    .trim(),
  description: Joi.string().min(10).required().trim(),
  image: Joi.binary()
    .encoding('base64')
    .max(5 * 1024 * 1024),
  categoryId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .trim(),
  authorId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .trim(),
  avgRating: Joi.number().min(0).max(5).precision(1),
  ratingsCount: Joi.number().min(0),
  reviews: Joi.array().items(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .trim()
  ),
  shelfName: Joi.string().valid('WANT_TO_READ', 'CURRENTLY_READING', 'READ', 'NONE'),
});

exports.validateAddBookData = (req, res, next) => {
  const { error, data } = addBookSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};

exports.validateUpdateBookData = (req, res, next) => {
  const { error, data } = updateBookSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};
