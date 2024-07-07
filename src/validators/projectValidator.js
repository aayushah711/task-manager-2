const Joi = require("joi");

const projectValidator = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  userIds: Joi.array().items(Joi.string()),
});

module.exports = projectValidator;
