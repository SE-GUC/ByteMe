const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the schema

const Mission_VisionSchema = new Schema({
  brief: {
    type: String,
    required: true
  }
});

module.exports = Mission_Vision = mongoose.model(
  "Mission_Vision",
  Mission_VisionSchema
);
