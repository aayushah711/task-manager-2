const express = require("express");
const {
  createProject,
  //   fetchProject,
  //   updateProject,
} = require("../controllers/projectController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// router.get("/", authenticateToken, fetchProject);
router.post("/", authenticateToken, createProject);

module.exports = router;
