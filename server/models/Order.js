const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    token: String,
    items: [
      {
        food: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
        qty: Number,
      },
    ],
    totalAmount: Number,
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);