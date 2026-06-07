import Joi from "joi";

const createOrganizationSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required().messages({
    "string.empty": "Organization name is required.",
    "string.min": "Organization name must be at least 2 characters.",
  }),
});

const updateGeneralSchema = Joi.object({
  logoUrl: Joi.string().uri().allow("", null),
  companyEmail: Joi.string().email().trim().allow("", null),
  companyPhone: Joi.string().trim().allow("", null),
  website: Joi.string().uri().allow("", null),
  address: Joi.string().max(255).trim().allow("", null),
  timezone: Joi.string().trim(),
  defaultLanguage: Joi.string().trim(),
  businessHours: Joi.string().trim(),
})
  .min(1)
  .messages({
    "object.min": "You must provide at least one general setting to update.",
  });

// const updateSecuritySchema = Joi.object({
//   passwordPolicy: Joi.string().valid("Standard", "Strong", "Custom"),
//   twoFactorAuthentication: Joi.boolean(),
//   enforce2FAForAdmins: Joi.boolean(),
//   sessionTimeout: Joi.number().integer().min(5).max(1440),
//   maxConcurrentSessions: Joi.number().integer().min(1).max(10),
//   ipWhitelisting: Joi.boolean(),
//   whitelistedIPs: Joi.array().items(
//     Joi.string().ip({ version: ["ipv4", "ipv6"] }),
//   ),
// })
//   .min(1)
//   .messages({
//     "object.min": "You must provide at least one security setting to update.",
//   });

const orgParamsSchema = Joi.object({
  orgId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Organization ID is required.",
    "string.hex": "Organization ID must be a valid hexadecimal string.",
    "string.length": "Organization ID must be exactly 24 characters long.",
  }),
});

const orgQuerySchema = Joi.object({
  isDeleted: Joi.boolean().required().messages({
    "boolean.base":
      "The isDeleted field must be a boolean value (true or false).",
    "any.required": "The isDeleted field is required.",
  }),
});

export {
  createOrganizationSchema,
  updateGeneralSchema,
  orgParamsSchema,
  orgQuerySchema,
};
