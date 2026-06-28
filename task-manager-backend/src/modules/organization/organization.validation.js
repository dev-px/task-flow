import Joi from "joi";

const createOrganizationSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().required().messages({
    "string.base": "Organization name must be a string.",
    "string.empty": "Organization name is required.",
    "string.min": "Organization name must be at least 2 characters.",
    "string.max": "Organization name cannot exceed 50 characters.",
  }),
  description: Joi.string().max(500).trim().allow("", null).messages({
    "string.max": "Description cannot exceed 500 characters.",
  }),
});

const updateOrganizationSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().messages({
    "string.base": "Organization name must be a string.",
    "string.empty": "Organization name cannot be empty.",
    "string.min": "Organization name must be at least 2 characters long.",
    "string.max": "Organization name cannot exceed 50 characters.",
  }),

  description: Joi.string().max(500).trim().allow("", null).messages({
    "string.max": "Description cannot exceed 500 characters.",
  }),

  logoUrl: Joi.string().uri().allow("", null).messages({
    "string.uri": "Logo URL must be a valid web address (URI).",
  }),

  companyEmail: Joi.string().email().trim().allow("", null).messages({
    "string.base": "Company email must be a string.",
    "string.email": "Please provide a valid email address.",
  }),

  companyPhone: Joi.string().trim().allow("", null).messages({
    "string.base": "Company phone must be a string.",
  }),

  website: Joi.string().uri().allow("", null).messages({
    "string.uri": "Website must be a valid web address (URI).",
  }),

  address: Joi.string().max(255).trim().allow("", null).messages({
    "string.base": "Address must be a string.",
    "string.max": "Address cannot exceed 255 characters.",
  }),

  timezone: Joi.string().trim().messages({
    "string.base": "Timezone must be a string.",
    "string.empty": "Timezone cannot be empty.",
  }),

  defaultLanguage: Joi.string().trim().messages({
    "string.base": "Default language must be a string.",
    "string.empty": "Default language cannot be empty.",
  }),

  businessHours: Joi.string().trim().messages({
    "string.base": "Business hours must be a string.",
    "string.empty": "Business hours cannot be empty.",
  }),
})
  .min(1)
  .messages({
    "object.min": "You must provide at least one field to update.",
  });

const orgParamsSchema = Joi.object({
  orgId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Organization ID is required.",
    "string.hex": "Organization ID must be a valid hexadecimal string.",
    "string.length": "Organization ID must be exactly 24 characters long.",
  }),
});

const orgQuerySchema = Joi.object({
  search: Joi.string().max(100).trim().allow("", null).messages({
    "string.max": "Search query cannot exceed 100 characters.",
  }),
  sortBy: Joi.string().messages({
    "string.base": "SortBy must be a string.",
  }),
  isDeleted: Joi.boolean().required().messages({
    "boolean.base":
      "The isDeleted field must be a boolean value (true or false).",
    "any.required": "The isDeleted field is required.",
  }),
});

export {
  createOrganizationSchema,
  updateOrganizationSchema,
  orgParamsSchema,
  orgQuerySchema,
};
