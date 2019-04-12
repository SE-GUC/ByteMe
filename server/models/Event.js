const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the schema
const EventSchema = new Schema({
  title: {
    type: String,
    unique: false,
    required: true
  },
  brief: {
    type: String,
    unique: false,
    required: true
  },
  location: {
    type: String,
    unique: false,
    required: true
  },
  dateTime: {
    type: Date,
    unique: false,
    required: true
  },
  description: {
    type: String,
    unique: false,
    required: true
  },
  photos: [
    {
      link: { type: String, unique: false, required: false }
      //default
    }
  ],

  comments: [
    {
      comment: { type: String, unique: false, required: false }
    }
  ],

  rates: [
    {
      rate: { type: Number, unique: false, required: false }
    }
  ],

  creator: {
    type: String,
    unique: false,
    required: true
  },

  rating: {
    type: Number,
    unique: false,
    required: false
  },

  comingSoon: {
    type: Boolean,
    required: false,
    default: true
  }
});
EventSchema.index({
  title: "text",
  description: "text",
  brief: "text",
  location: "text"
});

module.exports = Event = mongoose.model("Event", EventSchema);
