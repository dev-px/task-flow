import HTTP_STATUS from "../constants/http-status.constant.js";
import ApiError from "./../errors/ApiError.js";

const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
    });

    if (error) {
      const simpleErrors = {};
      error.details.forEach((err) => {
        simpleErrors[err.context.key] = err.message.replace(/"/g, "");
      });
      return next(
        new ApiError(
          res,
          "Validation Failed",
          HTTP_STATUS.BAD_REQUEST,
          simpleErrors,
        ),
      );
    }

    req[source] = value;
    next();
  };

// Usage:
// validate(mySchema, 'body')
// validate(mySchema, 'params')
// validate(mySchema, 'query')

export default validate;
