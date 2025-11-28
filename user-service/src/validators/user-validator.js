const Joi = require("joi");

exports.createUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("customer", "seller", "admin").required()
});
