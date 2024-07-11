const express = require("express");
const {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.get("/", fetchTasks);
router.post("/", authenticateToken, createTask);
router.put("/:taskId", authenticateToken, updateTask);
router.delete("/:taskId", authenticateToken, deleteTask);
// router.get("/user", getUserTasks);

module.exports = router;
