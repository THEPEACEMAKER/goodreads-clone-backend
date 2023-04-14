const Joi = require('joi');

const shelfSchema = Joi.object({
  bookId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .trim()
    .required(),
  shelf: Joi.string().valid('WANT_TO_READ', 'CURRENTLY_READING', 'READ', 'NONE').required(),
});

exports.validateShelfData = (req, res, next) => {
  const { error, data } = shelfSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.validatedData = data;
  next();
};
