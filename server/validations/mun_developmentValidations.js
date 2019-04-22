const Joi = require("joi");

module.exports = {
  createValidation: request => {
    const createSchema = {
      brief: Joi.string()
    };

    return Joi.validate(request, createSchema);
  },

  updateValidation: request => {
    const updateSchema = {
      brief: Joi.string()
    };

    return Joi.validate(request, updateSchema);
  }
};
