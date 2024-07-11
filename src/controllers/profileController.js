// @ts-nocheck
const User = require("../models/User");
const profileValidator = require("../validators/profileValidator");

exports.fetchProfile = async (req, res) => {
  try {
    const data = await User.findOne({ where: { email: req.user.email } });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { error } = profileValidator.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const data = await User.findOne({ where: { email: req.user.email } });
    const { firstName, lastName, profilePic } = req.body;
    data.set({
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(profilePic && { profilePic }),
    });
    await data.save();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error });
  }
};
