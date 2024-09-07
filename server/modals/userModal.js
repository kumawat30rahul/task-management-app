const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  logo: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  createdAt: {
    type: String,
    required: true,
    default: new Date(),
  },
  updatedAt: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
