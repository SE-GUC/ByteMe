const Joi = require('joi')

module.exports = {
    createValidation: request => {

        const createSchema = {
            name: Joi.string().min(1).max(500).required(),
            description: Joi.string().min(10).max(10000).required(),
            banner: Joi.string().min(5).max(1000).required(),
            link: Joi.string().min(3).max(100).required()
        }

        return Joi.validate(request, createSchema)
    },

    updateValidation: request => {
        const updateSchema = {
            name: Joi.string().min(1).max(500),
            description: Joi.string().min(10).max(10000),
            banner: Joi.string().min(5).max(1000),
            link: Joi.string().min(3).max(1000)
        }

        return Joi.validate(request, updateSchema)
    },
}