const Joi = require("joi");

module.exports = {
  createValidation: request => {
    const createSchema = {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{8,36}$/)
        .required(),

      first_name: Joi.string()
        .min(3)
        .max(36)
        .required(),
      last_name: Joi.string()
        .min(3)
        .max(36)
        .required(),
      birth_date: Joi.string().required(),

      guc_id: Joi.string()
        .regex(/^[0-9]{2,2}-[0-9]{1,6}$/)
        .required(),
      picture_ref: Joi.string(),
      is_private: Joi.boolean().required(),
      is_admin: Joi.boolean(),
      mun_role: Joi.string()
    };

    return Joi.validate(request, createSchema);
  },

  updateValidation: request => {
    const updateSchema = {
      email: Joi.string().email(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{8,36}$/),

      first_name: Joi.string()
        .min(3)
        .max(36),
      last_name: Joi.string()
        .min(3)
        .max(36),
      birth_date: Joi.string(),

      picture_ref: Joi.string(),
      is_private: Joi.boolean()
    };

    return Joi.validate(request, updateSchema);
  },

  giveAdminValidation: request => {
    const giveAdminValidationSchema = {
      guc_id: Joi.string()
        .regex(/^[0-9]{2,2}-[0-9]{1,6}$/)
        .required()
    };

    return Joi.validate(request, giveAdminValidationSchema);
  },
  /*
    giveMunRoleValidation: request => {
        const giveMunRoleValidationScheme = {
            guc_id: Joi.string().regex(/^[0-9]{2,2}-[0-9]{1,6}$/).required(),
            mun_role: Joi.number().required()
        }

        return Joi.validate(request, giveMunRoleValidationScheme)
    },
*/
  basicValidation: request => {
    const basicValidationScheme = {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{8,36}$/)
        .required()
    };

    return Joi.validate(request, basicValidationScheme);
  }
};
