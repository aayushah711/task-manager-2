const express = require("express");
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const membersRoutes = require("./src/routes/membersRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const sequelize = require("./src/config/database");
const User = require("./src/models/User");
const Project = require("./src/models/Project");
const Task = require("./src/models/Task");
const Comment = require("./src/models/Comment");
const Attachment = require("./src/models/Attachment");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/members", membersRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/comments", commentRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    User.belongsToMany(Project, { through: "UserProject" });
    Project.belongsToMany(User, { through: "UserProject" });

    Project.hasMany(Task, { foreignKey: "projectId" });
    Task.belongsTo(Project);

    User.hasMany(Task, { foreignKey: "createdBy" });
    Task.belongsTo(User, { foreignKey: "createdBy" });

    User.hasMany(Task, { foreignKey: "assignee" });
    Task.belongsTo(User, { foreignKey: "assignee" });

    Task.hasMany(Comment, { foreignKey: "taskId" });
    Comment.belongsTo(Task, { foreignKey: "taskId" });

    User.hasMany(Comment, { foreignKey: "createdBy" });
    Comment.belongsTo(User, { foreignKey: "createdBy" });

    Task.hasMany(Attachment, { foreignKey: "taskId" });
    Attachment.belongsTo(Task, { foreignKey: "taskId" });

    Comment.hasMany(Attachment, { foreignKey: "commentId" });
    Attachment.belongsTo(Comment, { foreignKey: "commentId" });

    sequelize
      .sync()
      .then(() => {
        console.log("UserProject table has been created.", sequelize.models);
      })
      .catch((err) => {
        console.error("Unable to create the UserProject table:", err);
      });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.sync();
    console.log("Database synced");
  } catch (error) {
    console.error("Unable to sync the database:", error);
  }
});

module.exports = app;
