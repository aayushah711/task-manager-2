const Joi = require("joi");

const createCommentValidator = Joi.object().keys({
  content: Joi.string().min(3).max(1000).required(),
  taskId: Joi.string().required(),
  attachments: Joi.array().items(Joi.string()).optional(),
});

const getCommentsValidator = Joi.object().keys({
  taskId: Joi.string().required(),
});

module.exports = { createCommentValidator, getCommentsValidator };
