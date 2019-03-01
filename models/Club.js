const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create the schema
const ClubSchema = new Schema({
    name: {
        type: String,
        unique : false,
        required: true
    },
    description: {
        type: String,
        unique : false, 
        required: true
    },
    banner: {
        type: String,
        unique : false,
        required: true
    },
    link: {
        type: String,
        unique : false,
        required: true
    }
        

})

module.exports = Club = mongoose.model('Club', ClubSchema)