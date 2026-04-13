const Category = require("../models/Category");
const Food = require("../models/Food");

exports.getCategories = async (req, res) => {
  try {
    const data = await Category.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.json(cat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!cat) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(cat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const count = await Food.countDocuments({
      category: req.params.id,
    });

    if (count > 0) {
      return res.status(400).json({
        message: "Category has related food items",
      });
    }

    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);

    if (!cat) {
      return res.status(404).json({ message: "Category not found" });
    }

    cat.isActive = !cat.isActive;
    await cat.save();

    res.json(cat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};