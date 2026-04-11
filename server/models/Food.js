const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: { type: String, default: "" },

    isActive: { type: Boolean, default: true },

    isSpecial: { type: Boolean, default: false },

    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);