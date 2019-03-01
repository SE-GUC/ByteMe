const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create the schema
const LibrarySchema = new Schema({
    
    name : {
        type: String,
        required: true
    }, 
    date : {
        type: Date,
        required: true
    },
    link : {
        type: String,
        required: true
    }
})
    

module.exports = Library = mongoose.model('Library', LibrarySchema)