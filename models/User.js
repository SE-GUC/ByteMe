const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    type: String,
    default:"none"
  },
  awg_admin: {
    type: String,
    default: "none"
  }
});


UserSchema.index({email:"text",first_name:"text", last_name:"text"});

module.exports.model = User = mongoose.model("users", UserSchema);
module.exports.hideSecrets = (user) => {
  const {
    email,
    first_name,
    last_name,
    birth_date,
    guc_id,
    picture_ref,
    is_admin,
    is_private,
    mun_role
  } = user;

  return {
    email: email,
    first_name: first_name,
    last_name: last_name,
    birth_date: birth_date,
    guc_id: guc_id,
    picture_ref: picture_ref,
    is_admin: is_admin,
    is_private: is_private,
    mun_role: mun_role
  };
}
