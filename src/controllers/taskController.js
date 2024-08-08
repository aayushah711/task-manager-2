// @ts-nocheck
const { Op } = require("sequelize");
const Attachment = require("../models/Attachment");
const Comment = require("../models/Comment");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const {
  createTaskValidator,
  getTasksValidator,
  updateTaskValidator,
} = require("../validators/taskValidator");
const _lodash = require("lodash");

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
  const userIsMember = await project.hasUser(user);
  if (!userIsMember) {
    return res
      .status(403)
      .json({ error: "Task creator is not a member of the project" });
  }

  const assigneeUser = value.assignee
    ? await User.findByPk(value.assignee)
    : null;
  if (value.assignee && !assigneeUser) {
    return res.status(404).json({ error: "Assignee not found" });
  }

  const assigneeIsMember = await project.hasUser(assigneeUser);
  if (value.assignee && !assigneeIsMember) {
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
      projectId: project.id,
    });

    let { attachments } = value;
    if (attachments?.length > 0) {
      const requestAttachments = attachments.map((att) => att.url);
      const attachmentPromises = requestAttachments.map((url) => {
        return Attachment.create({ url, taskId: task.id });
      });
      await Promise.all(attachmentPromises);
    }
    const createdTask = await Task.findByPk(task.id, {
      include: [
        {
          model: Comment,
          as: "comments",
          include: {
            model: Attachment,
            as: "attachments",
          },
        },
        {
          model: Attachment,
          as: "attachments",
        },
      ],
    });

    res
      .status(201)
      .json({ message: "Task created successfully!", task: createdTask });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.fetchTasks = async (req, res) => {
  try {
    const { error, value } = getTasksValidator.validate(req.query);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { projectId, status, search } = value;

    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const payload = {
      projectId,
      ...(status && { status }),
    };

    if (search) {
      payload[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const tasks = await Task.findAll({ where: payload });

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

    const { taskId } = req.params;
    const task = await Task.findByPk(taskId, {
      include: { model: Attachment, as: "attachments" },
    });
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.createdBy !== user.id) {
      return res.status(403).json({ error: "Unauthorized to update the task" });
    }

    const {
      title,
      description,
      dueDate,
      status,
      assignee,
      attachments,
      projectId,
    } = value;

    if (task.projectId !== projectId) {
      return res.status(400).json({
        error: "Switching the task's project is not allowed",
      });
    }

    // Update task details
    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;
    task.assignee = assignee || task.assignee;
    await task.save();

    // Add new attachments and Remove non existing attachments
    const currentAttachments = task.attachments.map((att) => att.url);
    const requestAttachments = attachments.map((att) => att.url);

    const newAttachments = requestAttachments.filter(
      (url) => !currentAttachments.includes(url)
    );
    const additionPromises = newAttachments.map((url) => {
      return Attachment.create({
        url,
        taskId: task.id,
      });
    });

    const attachmentsToRemove = task.attachments.filter(
      (att) => !requestAttachments.includes(att.url)
    );
    const removalPromises = attachmentsToRemove.map((att) => att.destroy());

    await Promise.all([...additionPromises, ...removalPromises]);

    const updatedTask = await Task.findByPk(taskId, {
      include: [
        {
          model: Comment,
          as: "comments",
          include: {
            model: Attachment,
            as: "attachments",
          },
        },
        {
          model: Attachment,
          as: "attachments",
        },
      ],
    });

    res
      .status(200)
      .json({ message: "Task updated successfully!", updatedTask });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.createdBy !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to delete the task" });
    }

    await task.destroy();

    res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.fetchTasksByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.findAll({
      where: { assignee: userId },
      include: { model: Project },
    });

    const tasksByProject = _lodash.groupBy(tasks, "projectId");

    res.status(200).json(tasksByProject);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.fetchTaskById = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const task = await Task.findByPk(taskId, {
      include: [
        {
          model: Comment,
          as: "comments",
          include: {
            model: Attachment,
            as: "attachments",
          },
        },
        {
          model: Attachment,
          as: "attachments",
        },
      ],
    });
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ error });
  }
};
