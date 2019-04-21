const Joi = require("joi");

module.exports = {
  createValidation: request => {
    const createSchema = {
      link: Joi.string()
    };
    return Joi.validate(request, createSchema);
  }
};
