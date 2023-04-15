const Joi = require('joi');

const addCategorySchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z\s\-]+$/)
    .min(3)
    .max(15)
    .required()
    .trim(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z\s\-]+$/)
    .min(3)
    .max(15)
    .trim(),
});

exports.validateAddCategoryData = (req, res, next) => {
  const { error, data } = addCategorySchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};

exports.validateUpdateCategoryData = (req, res, next) => {
  const { error, data } = updateCategorySchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};
