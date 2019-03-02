const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create the schema
const PageSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    members: [{
        guc_id: { type: String, required: true },
        is_pageHead: { type: Boolean, default: false, required: false },
    }],

    events: [{
        title: { type: String, unique: false },
        brief: { type: String, unique: false },
        location: { type: String, unique: false },


    }]
})

module.exports = Page = mongoose.model('Page', PageSchema)