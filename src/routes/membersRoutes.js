const express = require("express");
const { fetchMembers } = require("../controllers/membersController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.get("/", authenticateToken, fetchMembers);

module.exports = router;
