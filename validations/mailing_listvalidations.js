const Joi = require('joi')

module.exports = {

    createValidation: request => {

        const createSchema = Joi.object({

            email: Joi.string().email()

        })


        return Joi.validate(request, createSchema)

    },


}
