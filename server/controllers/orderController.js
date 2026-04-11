const Order = require("../models/Order");
const Food = require("../models/Food");
const Token = require("../models/Token");

exports.createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId) {
      return res.status(400).json({ msg: "userId is required for token generation" });
    }

    const todayDate = new Date().toISOString().split("T")[0];


    const tokenCount = await Token.countDocuments({ date: todayDate });
    const sequentialNum = (tokenCount + 1).toString().padStart(3, "0");
    const tokenNumber = `TOKEN-${todayDate.replace(/-/g, "")}-${sequentialNum}`;

    await Token.create({
      userId,
      date: todayDate,
      tokenNumber,
    });

    let total = 0;
    const orderItems = [];

    for (let i of items) {
      const food = await Food.findById(i._id);

      if (!food) {
        return res.status(400).json({ msg: "Food not found" });
      }

      total += food.price * i.qty;

      orderItems.push({
        food: food._id,
        qty: i.qty,
      });
    }

    const order = await Order.create({
      userId,
      token: tokenNumber,
      items: orderItems,
      totalAmount: total,
    });

    res.json(order);

  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUserOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const todayDate = new Date().toISOString().split("T")[0];

    const tokensToday = await Token.find({ userId, date: todayDate });
    const tokenNumbers = tokensToday.map(t => t.tokenNumber);

    const orders = await Order.find({
      userId,
      token: { $in: tokenNumbers },
      status: { $ne: 'Collected' }
    }).populate("items.food").sort({ _id: -1 });

    res.json(orders);
  } catch (err) {
    console.error("GET USER ORDER ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.food");
    res.json(orders);
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(order);
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};