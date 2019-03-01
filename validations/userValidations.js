const Joi = require('joi')

module.exports = {
    createValidation: request => {
        const createSchema = {
            email: Joi.string().email().required(),            
            password: Joi.string().regex(/^[a-zA-Z0-9]{8,36}$/),

            first_name: Joi.string().min(3).max(36).required(),
            last_name: Joi.string().min(3).max(36).required(),
            birth_date: Joi.string().required(),

            guc_id: Joi.string().regex(/^[0-9]{2,2}-[0-9]{1,6}$/),
            picture_ref: Joi.string(),
            is_admin: Joi.boolean().required(),
            is_private: Joi.boolean().required(),
        }

        return Joi.validate(request, createSchema)
    },

    updateValidation: request => {
        const updateSchema = {
            email: Joi.string().email(),            
            password: Joi.string().regex(/^[a-zA-Z0-9]{8,36}$/),

            first_name: Joi.string().min(3).max(36),
            last_name: Joi.string().min(3).max(36),
            birth_date: Joi.string(),

            guc_id: Joi.string().regex(/^[0-9]{2,2}-[0-9]{1,6}$/),
            picture_ref: Joi.string(),
            is_admin: Joi.boolean(),
            is_private: Joi.boolean(),
        }

        return Joi.validate(request, updateSchema)
    }, 
}