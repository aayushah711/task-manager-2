const express = require("express");
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const membersRoutes = require("./src/routes/membersRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/members", membersRoutes);
app.use("/project", projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
