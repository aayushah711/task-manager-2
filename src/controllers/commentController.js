// @ts-nocheck
const Attachment = require("../models/Attachment");
const Comment = require("../models/Comment");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const {
  createCommentValidator,
  getCommentsValidator,
} = require("../validators/commentValidator");

const validateComment = async (req, res) => {
  const { error, value } = createCommentValidator.validate(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  const task = await Task.findByPk(value.taskId);
  if (!task) return res.status(404).json({ error: "Task not found" });

  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const project = await Project.findByPk(task.projectId);
  if (!project) return res.status(404).json({ error: "Project not found" });

  const isMember = await project.hasUser(user);
  if (!isMember) {
    return res
      .status(403)
      .json({ error: "Only project members can add comments" });
  }

  return { value, task, user };
};

exports.createComment = async (req, res) => {
  try {
    const { value, task, user } = await validateComment(req, res);

    if (!value) return;

    const comment = await Comment.create({
      content: value.content,
      createdBy: user.id,
      taskId: task.id,
    });

    let { attachments } = value;
    if (attachments && attachments.length > 0) {
      const attachmentPromises = attachments.map((url) => {
        return Attachment.create({ url, commentId: comment.id });
      });
      await Promise.all(attachmentPromises);
    }

    res.status(201).json({ message: "Comment created successfully!", comment });
  } catch (error) {
    res.status(500).json({ error });
  }
};
