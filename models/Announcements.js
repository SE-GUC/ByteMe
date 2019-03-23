const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create the schema
const AnnouncementsSchema = new Schema({

    date: {
        type: Date,
        required: true
    },
    info: {
        type: String,
        required: true
    }

})
AnnouncementsSchema.index({info:"text"});

module.exports = Announcements = mongoose.model('Announcements', AnnouncementsSchema)