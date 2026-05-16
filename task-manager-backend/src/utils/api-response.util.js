/**
 * @param {Object} res - The response object
 * @param {string} message - The success message
 * @param {Object} data - The data to be sent in the response
 * @param {number} statusCode - The HTTP status code
 * @param {Object} meta - The metadata for the response
 */
const successResponse = (
  res,
  message = "Success",
  data = {},
  statusCode = 200,
  meta = {},
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

const errorResponse = (
  res,
  message = "Something went wrong",
  statusCode = 500,
  errors = [],
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export { successResponse, errorResponse };
