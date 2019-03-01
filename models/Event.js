const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create the schema
const EventSchema = new Schema({
    title: {
        type: String,
        unique : false,
        required: true
    },
    brief: {
        type: String,
        unique : false, 
        required: true
    },
    location: {
        type: String,
        unique : false,
        required: true
    },
    dateTime: {
        type: Date,
        unique : false,
        required: true
    },
    description: {
        type: String,
        unique : false, 
        required: true
    },
    photos:[{
         link:{type: String, unique : false, required: false}}],

    feedback : [{ content:{ type: String, unique : false, required: true}
                , rating:{ type: Number ,unique:false,required:true} 
                
                }],

    creator:{
        type: String,
        unique : false, 
        required: true
    }
        

})

module.exports = Event = mongoose.model('Event', EventSchema)