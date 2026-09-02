import Joi from "joi";

const checkAllTaskSchema = Joi.object({
  orgId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Organization ID is required.",
    "string.hex": "Organization ID must be a valid hexadecimal string.",
    "string.length": "Organization ID must be exactly 24 characters long.",
  }),
  projectId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Project ID is required.",
    "string.hex": "Project ID must be a valid hexadecimal string.",
    "string.length": "Project ID must be exactly 24 characters long.",
  }),
  taskId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Task ID is required.",
    "string.hex": "Task ID must be a valid hexadecimal string.",
    "string.length": "Task ID must be exactly 24 characters long.",
  }),
});

const getAllTaskQuerySchema = Joi.object({
  search: Joi.string().max(100).trim().allow("", null).messages({
    "string.max": "Search query cannot exceed 100 characters.",
  }),
  sortBy: Joi.string().messages({
    "string.base": "SortBy must be a string.",
  }),
  assignee: Joi.string().allow("").hex().length(24).messages({
    "string.hex": "Assignee must be a valid hexadecimal string.",
    "string.length": "Assignee must be exactly 24 characters long.",
  }),
  priority: Joi.string()
    .allow("")
    .valid("low", "medium", "high")
    .allow("")
    .messages({
      "string.base": "Status must be a string.",
      "any.only": "Status must be exactly one of: low, medium or high",
    }),
});

const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    "string.empty": "Task title is required.",
    "string.max": "Title cannot exceed 200 characters.",
  }),
  description: Joi.string().trim().max(5000).allow("", null).messages({
    "string.max": "Description cannot exceed 5000 characters.",
  }),
  priority: Joi.string().valid("low", "medium", "high").default("medium"),
  columnId: Joi.string().hex().length(24).allow(null),
  sprintId: Joi.string().hex().length(24).allow(null),
  assignees: Joi.array().items(Joi.string().hex().length(24)).default([]),
});

// Validates the Body for POST /tasks/:taskId/members
const addMembersSchema = Joi.object({
  memberIds: Joi.array()
    .items(Joi.string().hex().length(24).required())
    .min(1)
    .required()
    .messages({
      "array.min": "At least one member ID is required.",
      "any.required": "memberIds array is required.",
    }),
});

export {
  checkAllTaskSchema,
  getAllTaskQuerySchema,
  createTaskSchema,
  addMembersSchema,
};
