const Category = require("../models/Category");
const Food = require("../models/Food");

exports.getCategories = async (req, res) => {
  const data = await Category.find().sort({ createdAt: -1 });
  res.json(data);
};

exports.createCategory = async (req, res) => {
  const cat = await Category.create(req.body);
  res.json(cat);
};

exports.updateCategory = async (req, res) => {
  const cat = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(cat);
};

exports.deleteCategory = async (req, res) => {
  const count = await Food.countDocuments({
    category: req.params.id,
  });

  if (count > 0) {
    return res.status(400).json({
      message: "Category has related food items",
    });
  }

  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

exports.toggleCategory = async (req, res) => {
  const cat = await Category.findById(req.params.id);

  cat.isActive = !cat.isActive;
  await cat.save();

  res.json(cat);
};