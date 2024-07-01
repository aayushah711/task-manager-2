const Joi = require("joi");

const registerValidator = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
  profilePic: Joi.string(),
});

module.exports = registerValidator;
