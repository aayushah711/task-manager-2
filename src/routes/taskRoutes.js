const express = require("express");
const {
  fetchTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
  fetchTasksByUser,
} = require("../controllers/taskController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.get("/", fetchTasks);
router.get("/:taskId", fetchTaskById);
router.post("/", authenticateToken, createTask);
router.put("/:taskId", authenticateToken, updateTask);
router.delete("/:taskId", authenticateToken, deleteTask);
router.get("/user", authenticateToken, fetchTasksByUser);

module.exports = router;
