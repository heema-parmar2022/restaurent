const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await Admin.create({ ...req.body, password: hash });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Registration failed." });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const user = await Admin.findOne({ email: req.body.email });

    if (!user) return res.status(400).json({ msg: "Invalid" });

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) return res.status(400).json({ msg: "Invalid" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Login failed." });
  }
};
