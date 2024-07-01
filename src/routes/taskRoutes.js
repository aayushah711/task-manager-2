const express = require("express");
const {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  registerForTask,
  getUserTasks,
} = require("../controllers/taskController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/user", getUserTasks);

module.exports = router;
