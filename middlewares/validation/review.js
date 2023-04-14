const Joi = require('joi');

const addReviewSchema = Joi.object({
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

const updateReviewSchema = Joi.object({
  title: Joi.string().alphanum().min(3).max(100).trim(),
  content: Joi.string().min(3).trim(),
  reviewId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .trim(),
});

exports.validateAddReviewData = (req, res, next) => {
  const { error, data } = addReviewSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};

exports.validateUpdateReviewData = (req, res, next) => {
  const { error, data } = updateReviewSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};
