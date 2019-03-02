const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create the schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    birth_date: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    guc_id: {
        type: String,
        required: true
    },
    picture_ref: {
        type: String
    },
    is_admin: {
        type: Boolean,
        default: false,
        required: true
    },
    is_private: {
        type: Boolean,
        default: false,
        required: true
    },
    mun_role: {
        type: Number
    }
})

module.exports = User = mongoose.model('users', UserSchema)