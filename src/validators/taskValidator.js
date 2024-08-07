const Joi = require("joi");
const { taskStatus } = require("../constants");

const createTaskValidator = Joi.object().keys({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(1000).optional(),
  projectId: Joi.string(),
  dueDate: Joi.date().optional(),
  status: Joi.string().valid(...taskStatus),
  assignee: Joi.string().optional(),
});

const getTasksValidator = Joi.object().keys({
  projectId: Joi.string().required(),
  dueDate: Joi.date().optional(),
  status: Joi.string().valid(...taskStatus),
  assignee: Joi.string().optional(),
  search: Joi.string().optional(),
});

const updateTaskValidator = Joi.object().keys({
  id: Joi.string().optional(),
  title: Joi.string().min(3).max(255),
  description: Joi.string().max(1000),
  dueDate: Joi.date(),
  status: Joi.string().valid(...taskStatus),
  createdAt: Joi.string().optional(),
  updatedAt: Joi.string().optional(),
  projectId: Joi.string().optional(),
  createdBy: Joi.string().optional(),
  assignee: Joi.string(),
});

module.exports = {
  createTaskValidator,
  getTasksValidator,
  updateTaskValidator,
};
