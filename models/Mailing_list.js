const
    mongoose = require('mongoose')

const
    Schema = mongoose.Schema



// Create the schema

const
    Mailing_listSchema = new
        Schema({


            email: {
                type: String,
                unique: true,
                required: true
            }

        })



module.exports = Mailing_list = mongoose.model('Mailing_list', Mailing_listSchema)
