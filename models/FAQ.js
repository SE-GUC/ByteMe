const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create the schema
const FAQSchema = new Schema({
    
    Question : {
        type: String,
        required: true
    }, 
    Answer: {
        type: String,
        required: true
    },
  
})

module.exports = FAQ = mongoose.model('FAQ', FAQSchema)