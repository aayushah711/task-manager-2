const express = require("express");
const { createComment } = require("../controllers/commentController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.post("/", authenticateToken, createComment);

module.exports = router;
