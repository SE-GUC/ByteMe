const Joi = require("joi");

module.exports = {
  createValidation: request => {
    const createSchema = {
      Question: Joi.string()
        .min(3)
        .max(500)
        .required(),
      Answer: Joi.string()
        .min(3)
        .max(500)
        .required()
    };

    return Joi.validate(request, createSchema);
  },

  updateValidation: request => {
    const updateSchema = {
      Question: Joi.string()
        .min(3)
        .max(500),
      Answer: Joi.string()
        .min(3)
        .max(500)
    };

    return Joi.validate(request, updateSchema);
  }
};
