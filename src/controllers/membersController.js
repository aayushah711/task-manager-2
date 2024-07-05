const User = require("../models/User");

exports.fetchMembers = async (req, res) => {
  try {
    const data = await User.findAll();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error });
  }
};
