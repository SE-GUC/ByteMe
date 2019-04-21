const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the schema

const Mun_DevelopmentSchema = new Schema({
  brief: {
    type: String,
    required: true
  }
});

module.exports = Mun_Development = mongoose.model(
  "Mun_Development",
  Mun_DevelopmentSchema
);
