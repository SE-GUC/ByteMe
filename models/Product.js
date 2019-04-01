const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the schema

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: false
  },
  price: {
    type: Number,
    required: true
  },
  pic_ref: {
    type: String,
    default: false
  }
});

module.exports = Product = mongoose.model("products", ProductSchema);
