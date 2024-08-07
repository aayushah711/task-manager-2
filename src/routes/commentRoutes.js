const express = require("express");
const {
  fetchCommentsOfTask,
  createComment,
} = require("../controllers/commentController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.get("/", fetchCommentsOfTask);
router.post("/", authenticateToken, createComment);

module.exports = router;
