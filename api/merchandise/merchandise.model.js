var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema for Merchandise
var merchandiseSchema = new Schema({
    name :{
        type: String,
        unique : false,
        required : true,
    },
    price :{
        type: Number,
        unique : false,
        required : true,
    },
    img :{
        type: String,
        unique : false,
        required : false,
    }
}, {
    timestamps: true
});
module.exports = merchandiseSchema;