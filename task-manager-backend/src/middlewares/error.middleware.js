import env from "../config/env.config.js";
import HTTP_STATUS from "../constants/http-status.constant.js";
import { errorResponse } from "../utils/api-response.util.js";
import ERROR_MESSAGES from "./../errors/error.messages.js";

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  const isProduction = env.NODE_ENV === "production";

  return errorResponse(res, message, statusCode, err.errors || []);
};

export default errorMiddleware;
