var mongoose = require('mongoose');
var merchandiseSchema = require('./merchandise.model');

merchandiseSchema.statics = {
    create : function(data, cb) {
        var merchandise = new this(data);
        merchandise.save(cb);
    },

    get: function(query, cb) {
        this.find(query, cb);
    },

    getByName: function(query, cb) {
        this.find(query, cb);
    },

    update: function(query, updateData, cb) {
        this.findOneAndUpdate(query, {$set: updateData},{new: true}, cb);
    },

    delete: function(query, cb) {
        this.findOneAndDelete(query,cb);
    }
}

var merchandiseModel = mongoose.model('Merchandise', merchandiseSchema);
module.exports = merchandiseModel;