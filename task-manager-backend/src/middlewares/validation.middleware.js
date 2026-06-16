import HTTP_STATUS from "../constants/http-status.constant.js";
import ApiError from "./../errors/ApiError.js";

const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const payload = req?.[source] || {};
    console.log("Validating payload:", payload);
    const { error, value } = schema.validate(payload, {
      abortEarly: false,
      stripUnknown: true,
    });
    console.log("Validation result:", { error, value });
    if (error) {
      const simpleErrors = {};
      error.details.forEach((err) => {
        const key = err.path.join(".");
        simpleErrors[key] = err.message.replace(/"/g, "");
      });
      return next(
        new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "Validation Failed",
          simpleErrors,
        ),
      );
    }

    if (source === "query") {
      req.validatedQuery = value;
    } else {
      req[source] = value;
    }
    console.log(`Validation successful for ${source}:`, value);
    next();
  };

// Usage:
// validate(mySchema, 'body')
// validate(mySchema, 'params')
// validate(mySchema, 'query')

export default validate;

// req.query = value, JavaScript sees that req.query has only a "get" method and no "set" method. It blocks the operation entirely and throws the exact crash you saw:Cannot set property query of #<IncomingMessage> which has only a getter for query. This is a security feature in Node.js to prevent tampering with the request object.

// To fix this, you should assign the validated query parameters to a different property on the request object, such as req.validatedQuery. This way, you can keep the original req.query intact while still having access to the validated and sanitized query parameters in your controllers.
