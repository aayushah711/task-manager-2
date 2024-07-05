const Joi = require("joi");

const projectValidator = Joi.object().keys({
  name: Joi.string().required(),
  members: Joi.array().items(Joi.string()),
});

module.exports = projectValidator;
