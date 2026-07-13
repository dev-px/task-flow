import Joi from "joi";
import { ALL_PERMISSIONS } from "../../constants/permissions.constant.js";

const roleSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required().messages({
    "string.empty": "Role name is required.",
    "string.min": "Role name must be at least 2 characters.",
  }),
  description: Joi.string().trim().max(255).required().messages({
    "string.empty": "Description is required.",
    "string.max": "Description is too long (max 255 chars)",
    "string.base": "Description must be text",
  }),
  permissions: Joi.array()
    .items(Joi.string().valid(...ALL_PERMISSIONS)).unique().single()
    .min(1).max(ALL_PERMISSIONS.length).required()
    .messages({
      "array.unique": "Duplicate permissions are not allowed",
      "any.only": "One or more permissions are invalid",
      "array.min": "At least one permission must be selected",
      "any.required": "Permissions are required",
      "array.max": `You can select a maximum of ${ALL_PERMISSIONS.length} permissions`,
    }),
});

const editRoleSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required().messages({
    "string.empty": "Role name is required.",
    "string.min": "Role name must be at least 2 characters.",
  }),
  description: Joi.string().trim().max(255).required().messages({
    "string.empty": "Description is required.",
    "string.max": "Description is too long (max 255 chars)",
    "string.base": "Description must be text",
  }),
  permissions: Joi.array()
    .items(Joi.string().valid(...ALL_PERMISSIONS)).unique().single()
    .min(1).max(ALL_PERMISSIONS.length).required()
    .messages({
      "array.unique": "Duplicate permissions are not allowed",
      "any.only": "One or more permissions are invalid",
      "array.min": "At least one permission must be selected",
      "any.required": "Permissions are required",
      "array.max": `You can select a maximum of ${ALL_PERMISSIONS.length} permissions`,
    }),
})
  .min(1)
  .messages({
    "object.min": "You must provide at least one field to update.",
  });

const editParamsRoleSchema = Joi.object({
  orgId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Organization ID is required.",
    "string.hex": "Organization ID must be a valid hexadecimal string.",
    "string.length": "Organization ID must be exactly 24 characters long.",
  }),
  roleId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Role ID is required.",
    "string.hex": "Role ID must be a valid hexadecimal string.",
    "string.length": "Role ID must be exactly 24 characters long.",
  }),
});

const archieveRoleJustificationSchema = Joi.object({
  description: Joi.string()
    .trim()
    .max(500)
    .required()
    .allow("")
    .default("")
    .messages({
      "string.empty": "Justification is required.",
      "string.max": "Justification is too long (max 500 chars)",
      "string.base": "Justification must be text",
    }),
});

export {
  roleSchema,
  editRoleSchema,
  editParamsRoleSchema,
  archieveRoleJustificationSchema,
};
