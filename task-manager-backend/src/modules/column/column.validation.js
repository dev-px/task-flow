import Joi from "joi";

const columnParamsSchema = Joi.object({
    projectId: Joi.string().hex().length(24).required().messages({
        "string.empty": "Project ID is required.",
        "string.hex": "Project ID must be a valid hexadecimal string.",
        "string.length": "Project ID must be exactly 24 characters long.",
    }),
    columnId: Joi.string().hex().length(24).required().messages({
        "string.empty": "Column ID is required.",
        "string.hex": "Column ID must be a valid hexadecimal string.",
        "string.length": "Column ID must be exactly 24 characters long.",
    })
}).messages({
    "object.unknown": "Unknown column route parameter is not allowed.",
});


const createColumnSchema = Joi.object({
    title: Joi.string().trim().min(1).max(100).required().messages({
        "string.base": "Column title must be a string.",
        "string.empty": "Column title cannot be empty.",
        "string.min": "Column title must contain at least 1 character.",
        "string.max": "Column title cannot exceed 100 characters.",
        "any.required": "Column title is required.",
    }),
    description: Joi.string().trim().max(1000).allow("").default("").messages({
        "string.base": "Column description must be a string.",
        "string.max": "Column description cannot exceed 1000 characters.",
    }),
    // columnOrder: Joi.number().integer().min(0).required().messages({
    //     "number.base": "Column order must be a number.",
    //     "number.integer": "Column order must be a whole number.",
    //     "number.min": "Column order cannot be negative.",
    //     "any.required": "Column order is required.",
    // }),
}).messages({
    "object.unknown": "Unknown column field is not allowed.",
});

// const updateColumnSchema = createColumnSchema.fork(
//     ["title", "description", "columnOrder"],
//     (schema) => schema.optional(),
// ).custom((value, helpers) => {
//     if (!Object.keys(value).length) return helpers.error("object.min");
//     return value;
// }).messages({
//     "object.min": "At least one column field must be provided for update.",
//     "object.unknown": "Unknown column field is not allowed.",
// });


export {
    columnParamsSchema,
    createColumnSchema,
    // updateColumnSchema,
}