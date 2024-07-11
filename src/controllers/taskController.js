// @ts-nocheck
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const {
  createTaskValidator,
  getTaskValidator,
  updateTaskValidator,
} = require("../validators/taskValidator");

const validateAndAssignTask = async (req, res, isUpdate = false) => {
  const { error, value } = isUpdate
    ? updateTaskValidator.validate(req.body)
    : createTaskValidator.validate(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  const project = await Project.findByPk(value.projectId);
  if (!project) return res.status(404).json({ error: "Project not found" });

  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const assigneeUser = value.assignee
    ? await User.findByPk(value.assignee)
    : null;
  if (value.assignee && !assigneeUser) {
    return res.status(404).json({ error: "Assignee not found" });
  }

  const isMember = await project.hasUser(assigneeUser);
  if (value.assignee && !isMember) {
    return res
      .status(403)
      .json({ error: "Assignee is not a member of the project" });
  }

  return { value, project, user, assigneeUser };
};

exports.createTask = async (req, res) => {
  try {
    const { value, project, user, assigneeUser } = await validateAndAssignTask(
      req,
      res
    );

    if (!value) return;

    const task = await Task.create({
      ...value,
      ...(assigneeUser && { assignee: assigneeUser.id }),
      createdBy: user.id,
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
    const { value, user, assigneeUser } = await validateAndAssignTask(
      req,
      res,
      true
    );

    if (!value) return;

    const taskId = req.params.taskId;
    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.createdBy !== user.id) {
      return res.status(403).json({ error: "Unauthorized to update the task" });
    }

    await task.update({
      ...value,
      ...(assigneeUser && { assignee: assigneeUser.id }),
    });

    res.status(200).json({ message: "Task updated successfully!", task });
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
