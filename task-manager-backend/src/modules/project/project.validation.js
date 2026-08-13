import Joi from "joi";

const projectQuerySchema = Joi.object({
  search: Joi.string().max(100).trim().allow("", null).messages({
    "string.max": "Search query cannot exceed 100 characters.",
  }),
  sortBy: Joi.string().messages({
    "string.base": "SortBy must be a string.",
  }),
  status: Joi.string()
    .valid("active", "archived", "completed")
    .allow("")
    .messages({
      "string.base": "Status must be a string.",
      "any.only":
        "Status must be exactly one of: active, archived or completed",
    }),
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a valid number.",
    "number.integer": "Page must be a whole number.",
    "number.min": "Page number cannot be less than 1.",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit must be a valid number.",
    "number.integer": "Limit must be a whole number.",
    "number.min": "Limit cannot be less than 1.",
    "number.max": "Limit cannot exceed 100 items per page.",
  }),
});

const newProjectBodySchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Title cannot be empty.",
    "string.min": "Title must be at least 3 characters long.",
    "any.required": "Title is required.",
  }),

  description: Joi.string().trim().max(1000).required().messages({
    "string.max": "Description cannot exceed 1000 characters.",
    "string.empty": "Description cannot be empty.",
    "any.required": "Description is required.",
  }),

  startDate: Joi.date().required(),

  dueDate: Joi.date().allow(null).min(Joi.ref("startDate")).messages({
    "date.min": "Due date cannot be earlier than the start date.",
  }),

  priority: Joi.string()
    .valid("low", "medium", "high", "urgent")
    .default("medium")
    .optional()
    .empty("")
    .messages({
      "any.only": "Priority must be one of: low, medium, high, urgent.",
    }),

  status: Joi.string()
    .valid("planning", "active", "on-hold", "archived", "completed")
    .default("planning")
    .optional()
    .empty("")
    .messages({
      "any.only":
        "Status must be one of: planning, active, on-hold, archived, completed.",
    }),
});

const projectParamSchema = Joi.object({
  orgId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Organization ID is required.",
    "string.hex": "Organization ID must be a valid hexadecimal string.",
    "string.length": "Organization ID must be exactly 24 characters long.",
  }),
  projectId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Organization ID is required.",
    "string.hex": "Organization ID must be a valid hexadecimal string.",
    "string.length": "Organization ID must be exactly 24 characters long.",
  }),
});

const updateProjectBodySchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).messages({
    "string.empty": "Title cannot be empty.",
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title cannot exceed 100 characters.",
  }),
  description: Joi.string().trim().max(1000).allow("", null).messages({
    "string.max": "Description cannot exceed 1000 characters.",
    "string.empty": "Description cannot be empty.",
  }),
  startDate: Joi.date().required(),
  
  dueDate: Joi.date().allow(null).min(Joi.ref("startDate")).messages({
    "date.min": "Due date cannot be earlier than the start date.",
  }),

  priority: Joi.string().valid("low", "medium", "high", "urgent").messages({
    "any.only": "Priority must be one of: low, medium, high, urgent.",
  }),
  status: Joi.string()
    .valid("planning", "active", "on-hold", "completed", "archived")
    .messages({
      "any.only":
        "Status must be one of: planning, active, on-hold, completed, archived.",
    }),
  links: Joi.array().items(
    Joi.object({
      label: Joi.string().required(),
      link: Joi.string().uri().required(),
    }).messages({
      "object.unknown": "Invalid link object.",
      "string.empty": "Link label is required.",
      "string.uri": "Link must be a valid URI.",
    }),
  ),
  documents: Joi.array().items(
    Joi.object({
      label: Joi.string().required(),
      url: Joi.string().uri().required(),
      name: Joi.string(),
      type: Joi.string(),
    }).messages({
      "object.unknown": "Invalid document object.",
      "string.empty": "Document label is required.",
      "string.uri": "Document URL must be a valid URI.",
    }),
  ),
}).min(1);

const addProjectMemberBodySchema = Joi.object({
  memberId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Member ID is required.",
    "string.hex": "Member ID must be a valid hexadecimal string.",
    "string.length": "Member ID must be exactly 24 characters long.",
  }),
  roleId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Role ID is required.",
    "string.hex": "Role ID must be a valid hexadecimal string.",
    "string.length": "Role ID must be exactly 24 characters long.",
  }),
});

const getAllMemberforProjectSchema = Joi.object({
  search: Joi.string().max(100).trim().allow("", null).messages({
    "string.max": "Search query cannot exceed 100 characters.",
  }),
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a valid number.",
    "number.integer": "Page must be a whole number.",
    "number.min": "Page number cannot be less than 1.",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit must be a valid number.",
    "number.integer": "Limit must be a whole number.",
    "number.min": "Limit cannot be less than 1.",
    "number.max": "Limit cannot exceed 100 items per page.",
  }),
});

const projectMemberParamSchema = Joi.object({
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
  memberId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Member ID is required.",
    "string.hex": "Member ID must be a valid hexadecimal string.",
    "string.length": "Member ID must be exactly 24 characters long.",
  }),
});

export {
  projectQuerySchema,
  projectParamSchema,
  newProjectBodySchema,
  updateProjectBodySchema,
  getAllMemberforProjectSchema,
  addProjectMemberBodySchema,
  projectMemberParamSchema,
};
