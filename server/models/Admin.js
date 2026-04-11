const mongoose = require("mongoose");

module.exports = mongoose.model("Admin", {
  name: String,
  email: String,
  password: String,
});