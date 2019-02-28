const Joi = require('joi')

module.exports = {
    createValidation: request => {
        const createSchema = {
            title: Joi.string().min(3).max(500).required(),
            brief: Joi.string().min(5).max(1000).required(),
            location: Joi.string().min(3).max(100).required(),
            dateTime:Joi.date().iso().required(),
            description: Joi.string().min(10).max(10000).required(),
            

        }

        return Joi.validate(request, createSchema)
    },

    updateValidation: request => {
        const updateSchema = {
            title: Joi.string().min(3).max(500),
            brief: Joi.string().min(5).max(1000),
            location: Joi.string().min(3).max(100),
            dateTime:Joi.date().iso(),
            description: Joi.string().min(10).max(10000),
            
            
        }

        return Joi.validate(request, updateSchema)
    }, 
    createFeedbackValidation: request => {
        const objectSchema = Joi.object().keys({
            content: Joi.string().required(),
            rating:Joi.number().min(0).max(5).required()
          })
        const addSchema = {
            feedback: Joi.array().items(objectSchema)
        }

        return Joi.validate(request, addSchema)
    }, 
    photoValidation: request => {
        const objectSchema = Joi.object().keys({
            link: Joi.string().required()
          })
        const addSchema = {
            photos: Joi.array().items(objectSchema)
        }

        return Joi.validate(request, addSchema)
    }, 
}