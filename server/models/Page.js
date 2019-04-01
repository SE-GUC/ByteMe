const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the schema
const PageSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  role_to_control: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  members: [
    {
      guc_id: { type: String, required: true }
    }
  ]
});

module.exports = Page = mongoose.model("Page", PageSchema);
