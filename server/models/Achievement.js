const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the schema

const AchievementSchema = new Schema({
  description: {
    type: String,
    required: true
  },

  pic_ref: {
    type: String,
    default: "https://merry-berry.ua/wp-content/uploads/2019/02/default.png"
  }
});
module.exports = Achievement = mongoose.model("Achievement", AchievementSchema);
