const Joi = require("joi");

module.exports = {
  createValidation: request => {
    const createSchema = {
      name: Joi.string().required(),
      description: Joi.string().required(),
      banner: Joi.string(),
      link: Joi.string().required()
    };

    return Joi.validate(request, createSchema);
  },

  updateValidation: request => {
    const updateSchema = {
      name: Joi.string(),
      description: Joi.string()
      ,
      banner: Joi.string()
       ,
      link: Joi.string()
      
    };

    return Joi.validate(request, updateSchema);
  }
};
