const Joi = require('joi');

const ratingSchema = Joi.object({
  rate: Joi.number().min(0).max(5).required(),
});

exports.validateRatingData = (req, res, next) => {
  const { error, data } = ratingSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};
