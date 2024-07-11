const Joi = require("joi");

const createTaskValidator = Joi.object().keys({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(1000).optional(),
  projectId: Joi.string(),
  dueDate: Joi.date().optional(),
  completed: Joi.boolean().default(false),
  assignee: Joi.string().optional(),
});

const getTaskValidator = Joi.object().keys({
  projectId: Joi.string().required(),
  dueDate: Joi.date().optional(),
  completed: Joi.boolean().default(false),
  assignee: Joi.string().optional(),
});

const updateTaskValidator = Joi.object().keys({
  title: Joi.string().min(3).max(255),
  description: Joi.string().max(1000),
  projectId: Joi.string(),
  dueDate: Joi.date(),
  completed: Joi.boolean(),
  assignee: Joi.string(),
});

module.exports = { createTaskValidator, getTaskValidator, updateTaskValidator };
