const router = require("express").Router();
const controller = require("../controllers/categoryController");

router.get("/", controller.getCategories);
router.post("/", controller.createCategory);
router.put("/:id", controller.updateCategory);
router.delete("/:id", controller.deleteCategory);
router.put("/:id/toggle", controller.toggleCategory);

module.exports = router;