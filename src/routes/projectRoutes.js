const express = require("express");
const {
  createProject,
  fetchUserProjects,
} = require("../controllers/projectController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.get("/user", authenticateToken, fetchUserProjects);
router.post("/", authenticateToken, createProject);

module.exports = router;
