import Joi from "joi";

const editUserProfileSchemaJOI = Joi.object({
  name: Joi.string().min(2).max(50).trim().messages({
    "string.empty": "Name cannot be empty.",
    "string.min": "Name must be at least 2 characters long.",
    "string.max": "Name cannot exceed 50 characters.",
  }),

  secondaryEmail: Joi.string().email().allow(null, "").messages({
    "string.email": "Please provide a valid secondary email address.",
  }),

  timezone: Joi.string().messages({
    "string.empty": "Timezone cannot be blank.",
  }),
})
  .min(1)
  .messages({
    "object.min": "You must provide at least one field to update.",
  });

const editProfilePhotoSchemaJOI = Joi.object({
  avatarUrl: Joi.string().uri().required().messages({
    "string.empty": "Avatar URL cannot be empty.",
    "string.uri": "Please provide a valid URL for the avatar.",
  }),
});

export { editUserProfileSchemaJOI, editProfilePhotoSchemaJOI };
