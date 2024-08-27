const express = require("express");
const {
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.post("/", authenticateToken, createComment);
router.put("/", authenticateToken, updateComment);
router.delete("/:commentId", authenticateToken, deleteComment);

module.exports = router;
