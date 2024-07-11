const Joi = require("joi");

const createTaskValidator = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().optional(),
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

module.exports = { createTaskValidator, getTaskValidator };
