const router = require("express").Router();

const {
  createOrder,
  getOrders,
  updateOrderStatus,
  getUserOrder
} = require("../controllers/orderController");

router.post("/", createOrder);

router.get("/", getOrders);

router.get("/user/:userId", getUserOrder);

router.put("/:id/status", updateOrderStatus);

module.exports = router;