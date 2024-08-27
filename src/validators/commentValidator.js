const Joi = require("joi");

const createCommentValidator = Joi.object().keys({
  content: Joi.string().min(3).max(1000).required(),
  taskId: Joi.string().required(),
  attachments: Joi.array().items(Joi.string()).optional(),
});

const getCommentsValidator = Joi.object().keys({
  taskId: Joi.string().required(),
});

const updateCommentValidator = Joi.object().keys({
  content: Joi.string().min(3).max(1000).required(),
  attachments: Joi.array().items(Joi.string()).optional(),
});

const deleteCommentValidator = Joi.object().keys({
  commentId: Joi.string().required(),
});

module.exports = {
  createCommentValidator,
  getCommentsValidator,
  updateCommentValidator,
  deleteCommentValidator,
};
