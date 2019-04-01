const Joi = require("joi");

module.exports = {
  createValidation: request => {
    /*  const eventsSchema = Joi.object({
      title: Joi.string().min(3).max(500),
      brief: Joi.string().min(5).max(1000),
      location: Joi.string().min(3).max(100),


    }) */

    const membersSchema = Joi.object({
      guc_id: Joi.string().regex(/^[0-9]{2,2}-[0-9]{1,6}$/)
    });

    const createSchema = {
      name: Joi.string()
        .min(3)
        .max(500)
        .required(),
      role_to_control: Joi.string()
        .min(3)
        .max(500)
        .required(),
      description: Joi.string()
        .min(5)
        .max(1000),
      members: Joi.array().items(membersSchema)
      //    events: Joi.array().items(eventsSchema)
    };

    return Joi.validate(request, createSchema);
  },

  updateValidation: request => {
    const updateSchema = {
      name: Joi.string()
        .min(3)
        .max(500),
      description: Joi.string().min(5),
      role_to_control: Joi.string()
        .min(3)
        .max(500)
    };

    return Joi.validate(request, updateSchema);
  },

  /* addEventValidation: request => {

    const eventsSchema = Joi.object({
      title: Joi.string().min(3).max(500).required(),
      brief: Joi.string().min(5).max(1000).required(),
      location: Joi.string().min(3).max(100).required(),


    })


    return Joi.validate(request, eventsSchema)
  }, */

  addMemberValidation: request => {
    const membersSchema = Joi.object({
      guc_id: Joi.string()
        .regex(/^[0-9]{2,2}-[0-9]{1,6}$/)
        .required()
    });

    return Joi.validate(request, membersSchema);
  }
};
