const express = require("express");
const {
  createProject,
  fetchUserProjects,
  fetchProjectById,
} = require("../controllers/projectController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.get("/", authenticateToken, fetchUserProjects);
router.get("/:projectId", authenticateToken, fetchProjectById);
router.post("/", authenticateToken, createProject);

module.exports = router;
