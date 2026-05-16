import Joi from "joi";

const signUpUserSchemaJOI = Joi.object({
  name: Joi.string().min(2).max(50).trim().required().messages({
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 2 characters long",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
});

const loginUserSchemaJOI = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
});

export { signUpUserSchemaJOI, loginUserSchemaJOI };
