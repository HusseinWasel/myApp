const mongoose = require("mongoose");
const trip = require("./trip");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 50,
  },
 
});

module.exports = mongoose.model("user", userSchema);
