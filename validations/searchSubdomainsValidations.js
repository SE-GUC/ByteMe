const Joi = require("joi");

module.exports = {
  createValidation: request => {
    const createSchema = Joi.object({
      searchkey: Joi.string()
    });

    return Joi.validate(request, createSchema);
  }
};
