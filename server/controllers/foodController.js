const Food = require("../models/Food");

exports.getFoods = async (req, res) => {
  try {
    console.log("CI/CD working");
    const { page = 1, limit = 10, special } = req.query;

    const query = {};

    if (special === "true") {
      query.isSpecial = true;
    }

    const skip = (page - 1) * limit;

    const total = await Food.countDocuments(query);

    const foods = await Food.find(query)
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      data: foods,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching foods" });
  }
};



exports.createFood = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.image = req.file.filename;
    }

    const food = await Food.create(data);
    res.json(food);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating food" });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.image = req.file.filename;
    }

    const food = await Food.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.json(food);
  } catch {
    res.status(500).json({ message: "Error updating" });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ message: "Error deleting" });
  }
};

exports.toggleSpecial = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    food.isSpecial = !food.isSpecial;
    await food.save();

    res.json(food);
  } catch {
    res.status(500).json({ message: "Error updating special" });
  }
};

exports.toggleActive = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    food.isActive = !food.isActive;
    await food.save();

    res.json(food);
  } catch {
    res.status(500).json({ message: "Error updating status" });
  }
};