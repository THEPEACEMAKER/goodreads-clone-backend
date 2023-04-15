const Joi = require('joi');

const addReviewSchema = Joi.object({
  title: Joi.string().alphanum().min(3).max(100).required().trim(),
  content: Joi.string().min(3).required().trim()
});

const updateReviewSchema = Joi.object({
  title: Joi.string().alphanum().min(3).max(100).trim(),
  content: Joi.string().min(3).trim()
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
