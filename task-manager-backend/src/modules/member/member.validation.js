import Joi from "joi";

const getMemberParams = Joi.object({
  orgId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Organization ID is required.",
    "string.hex": "Organization ID must be a valid hexadecimal string.",
    "string.length": "Organization ID must be exactly 24 characters long.",
  }),
  memberId: Joi.string().hex().length(24).messages({
    "string.hex": "Member ID must be a valid hexadecimal string.",
    "string.length": "Member ID must be exactly 24 characters long.",
  }),
});

const getMembersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow(""),
  designation: Joi.string().trim().allow(""),
  status: Joi.string().valid("invited", "active", "suspended").allow(""),
  employeeId: Joi.string().trim().allow(""),
  workType: Joi.string()
    .valid("full-time", "part-time", "contractor")
    .allow(""),
  isArchived: Joi.boolean(),
});

const getMembersByIdQuerySchema = Joi.object({
  // if admin want to see archieved member
  isArchived: Joi.boolean(),
});

// --- NEW INVITE SCHEMAS BELOW ---

const inviteSingleMemberSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.base": "Email must be a valid string.",
    "string.empty": "Email address cannot be empty.",
    "string.email": "Please provide a valid email address.",
    "any.required": "Email address is required to send an invite.",
  }),
  role: Joi.string().trim().required().messages({
    "string.base": "Role must be a valid string.",
    "string.empty": "Role cannot be empty.",
    "any.required": "Role is required to assign to the invited member.",
  }),
});

// Schema for a single row in the bulk invite Excel/JSON array
const bulkInviteItemSchema = Joi.object({
  // Using Capital 'Email' and 'Role' to match your previous Excel parsing logic
  // (Change these to lowercase if your frontend maps them to standard JSON format first)
  Email: Joi.string().email().trim().lowercase().required().messages({
    "string.empty": "A row is missing an email address.",
    "string.email": "A row contains an invalid email address: {#value}",
    "any.required": "Email is required for all rows.",
  }),
  Role: Joi.string().trim().required().messages({
    "string.empty": "A row is missing a role.",
    "any.required": "Role is required for all rows.",
  }),
}).unknown(true); // .unknown(true) allows ignoring extra columns from the Excel file (e.g., "Name", "Department")

const bulkInviteSchema = Joi.object({
  // Assuming the frontend sends the array wrapped in an object like { excelData: [...] }
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
  token: Joi.string().required().messages({
    "string.base": "Token must be a valid string.",
    "string.empty": "Invitation token cannot be empty.",
    "any.required": "Invitation token is required to accept the invite.",
  }),

  name: Joi.string().trim().min(2).max(50).optional().messages({
    "string.base": "Name must be a valid string.",
    "string.empty": "Name cannot be empty.",
    "string.min": "Name must be at least 2 characters long.",
    "string.max": "Name cannot exceed 50 characters.",
  }),

  password: Joi.string().min(8).optional().messages({
    "string.base": "Password must be a valid string.",
    "string.empty": "Password cannot be empty.",
    "string.min": "Password must be at least 8 characters long.",
  }),

  avatarUrl: Joi.string().uri().optional().messages({
    "string.base": "Avatar URL must be a valid string.",
    "string.empty": "Avatar URL cannot be empty.",
    "string.uri": "Please provide a valid URL for the avatar image.",
  }),
});

export {
  getMemberParams,
  getMembersQuerySchema,
  getMembersByIdQuerySchema,
  inviteSingleMemberSchema,
  bulkInviteSchema,
  acceptInviteBodySchema,
};
