const Joi = require("joi");

module.exports = {
  createValidation: request => {
    const createSchema = {
      name: Joi.string()
        .min(3)
        .max(500)
        .required(),
      date: Joi.date(),
      link: Joi.string(),
      year: Joi.number()
    };
    return Joi.validate(request, createSchema);
  },
  updateValidation: request => {
    const updateSchema = {
      name: Joi.string()
        .min(3)
        .max(500),
      date: Joi.date(),
      link: Joi.string(),
      year: Joi.number()
    };
    return Joi.validate(request, updateSchema);
  }
};
