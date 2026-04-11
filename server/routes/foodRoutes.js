
const express = require("express");
const router = express.Router();

const foodController = require("../controllers/foodController");
const upload = require("../config/multer");

router.post("/", upload.single("image"), foodController.createFood);
router.put("/:id", upload.single("image"), foodController.updateFood);
router.get("/", foodController.getFoods);
router.post("/", foodController.createFood);
router.put("/:id", foodController.updateFood);
router.delete("/:id", foodController.deleteFood);

router.put("/:id/special", foodController.toggleSpecial);
router.put("/:id/toggle", foodController.toggleActive);

module.exports = router;