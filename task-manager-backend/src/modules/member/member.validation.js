import Joi from "joi";
import { ALL_PERMISSIONS } from "../../constants/permissions.constant.js";

const getMemberParams = Joi.object({
  orgId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Organization ID is required.",
    "string.hex": "Organization ID must be a valid hexadecimal string.",
    "string.length": "Organization ID must be exactly 24 characters long.",
  }),
  invitedmemberId: Joi.string().hex().length(24).messages({
    "string.hex": "Member ID must be a valid hexadecimal string.",
    "string.length": "Member ID must be exactly 24 characters long.",
  }),
});

const getMembersQuerySchema = Joi.object({
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
  search: Joi.string().trim().allow("").messages({
    "string.base": "Search query must be a string of text.",
  }),
  sortBy: Joi.string().messages({
    "string.base": "SortBy must be a string.",
  }),
  status: Joi.string()
    .valid("invited", "active", "suspended", "expired", "cancelled")
    .allow("")
    .messages({
      "string.base": "Status must be a string.",
      "any.only":
        "Status must be exactly one of: invited, active, suspended, expired, or cancelled.",
    }),
  isDeleted: Joi.boolean().messages({
    "boolean.base": "isDeleted must be a true or false value.",
  }),
});

const getMembersByIdQuerySchema = Joi.object({
  // if admin wants to see archived member
  isDeleted: Joi.boolean().messages({
    "boolean.base": "isDeleted flag must be either true or false.",
  }),
});

// --- NEW INVITE SCHEMAS BELOW ---
const inviteSingleMemberSchema = Joi.object({
  designation: Joi.string().trim().max(100).required().messages({
    "string.base": "Designation must be a valid string.",
    "string.empty": "Designation cannot be empty.",
    "string.max": "Designation cannot exceed 100 characters.",
    "any.required": "Designation is required to send an invite.",
  }),
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.base": "Email must be a valid string.",
    "string.empty": "Email address cannot be empty.",
    "string.email": "Please provide a valid email address.",
    "any.required": "Email address is required to send an invite.",
  }),
  role: Joi.string().hex().length(24).required().messages({
    "string.empty": "Organization ID is required.",
    "string.hex": "Organization ID must be a valid hexadecimal string.",
    "string.length": "Organization ID must be exactly 24 characters long.",
  }),
});

// Schema for a single row in the bulk invite Excel/JSON array
const bulkInviteItemSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.empty": "A row is missing an email address.",
    "string.email": "A row contains an invalid email address: {#value}",
    "any.required": "Email is required for all rows.",
  }),
  role: Joi.string().trim().required().messages({
    "string.empty": "A row is missing a role.",
    "any.required": "Role is required for all rows.",
  }),
  designation: Joi.string().trim().max(100).required().messages({
    "string.base": "Designation must be a valid string.",
    "string.empty": "Designation cannot be empty.",
    "string.max": "Designation cannot exceed 100 characters.",
    "any.required": "Designation is required to send an invite.",
  }),
});

const bulkInviteSchema = Joi.object({
  excelData: Joi.array()
    .items(bulkInviteItemSchema)
    .min(1)
    .max(500)
    .required()
    .messages({
      "array.base": "Bulk invites must be an array of objects.",
      "array.min": "Please provide at least one valid row to process.",
      "array.max":
        "To maintain performance, you can only invite up to 500 members at a time.",
      "any.required": "The excel data payload is required.",
    }),
});

const acceptInviteBodySchema = Joi.object({
  name: Joi.string().trim().max(50).optional().messages({
    "string.base": "Name must be a valid string.",
    "string.max": "Name cannot exceed 50 characters.",
  }),

  password: Joi.string().optional().messages({
    "string.base": "Password must be a valid string.",
  }),

  avatarUrl: Joi.string().uri().optional().messages({
    "string.base": "Avatar URL must be a valid string.",
    "string.uri": "Please provide a valid URL for the avatar image.",
  }),
});

const verifyInviteQuerySchema = Joi.object({
  token: Joi.string().required().messages({
    "string.base": "Token must be a valid string.",
    "string.empty": "Invitation token cannot be empty.",
    "any.required": "Invitation token is required to accept the invite.",
  }),
});

const editMemberDetailsSchema = Joi.object({
  designation: Joi.string().trim().max(100).messages({
    "string.base": "Designation must be a valid string.",
    "string.max": "Designation cannot exceed 100 characters.",
    "any.required": "Designation is required for the member.",
  }),
  roleId: Joi.string().trim().optional().messages({
    "string.base": "Role must be a valid string.",
  }),
  additionalPermissions: Joi.array()
    .items(Joi.string().valid(...ALL_PERMISSIONS)).unique().single()
    .max(ALL_PERMISSIONS.length).required()
    .messages({
      "array.unique": "Duplicate permissions are not allowed",
      "any.only": "One or more permissions are invalid",
      "any.required": "Permissions are required",
      "array.max": `You can select a maximum of ${ALL_PERMISSIONS.length} permissions`,
    }),
});

export {
  getMemberParams,
  getMembersQuerySchema,
  getMembersByIdQuerySchema,
  inviteSingleMemberSchema,
  bulkInviteSchema,
  verifyInviteQuerySchema,
  acceptInviteBodySchema,
  editMemberDetailsSchema
};

