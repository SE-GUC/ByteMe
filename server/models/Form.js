const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the schema

const FormSchema = new Schema({
  link: {
    type: String,
    required: true
  }
});

module.exports = link = mongoose.model("Form", FormSchema);
