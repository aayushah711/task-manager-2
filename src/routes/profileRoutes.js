const express = require("express");
const {
  fetchProfile,
  updateProfile,
} = require("../controllers/profileController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.get("/", authenticateToken, fetchProfile);
router.put("/", authenticateToken, updateProfile);

module.exports = router;
