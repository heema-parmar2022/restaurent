const mongoose = require("mongoose");

module.exports = mongoose.model("Category", {
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});