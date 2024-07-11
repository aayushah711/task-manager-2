// @ts-nocheck
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const {
  createTaskValidator,
  getTaskValidator,
} = require("../validators/taskValidator");

exports.createTask = async (req, res) => {
  try {
    const { error, value } = createTaskValidator.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const project = await Project.findByPk(value.projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const creator = await User.findByPk(req.user.id);
    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }

    const assigneeUser = value.assignee
      ? await User.findByPk(value.assignee)
      : null;
    if (value.assignee && !assigneeUser) {
      return res.status(404).json({ error: "Assignee not found" });
    }

    // Check if assignee is a member of the project
    const isMember = await project.hasUser(assigneeUser);
    if (value.assignee && !isMember) {
      return res
        .status(403)
        .json({ error: "Assignee is not a member of the project" });
    }

    const task = await Task.create({
      ...value,
      ...(assigneeUser && { assignee: assigneeUser.id }),
      createdBy: creator.id,
    });

    await task.setProject(project);

    res.status(201).json({ message: "Task created successfully!", task });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.fetchTasks = async (req, res) => {
  try {
    const { error, value } = getTaskValidator.validate(req.query);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { projectId } = value;

    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const tasks = await Task.findAll({ where: { ProjectId: projectId } });

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.updateTask = async (req, res) => {
  try {
    res.status(200).json({ message: "Updated" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
