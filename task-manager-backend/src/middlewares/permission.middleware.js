import ApiError from "../errors/ApiError.js";
import HTTP_STATUS from "../constants/http-status.constant.js";

const validateRequiredPermissions =
  (requiredPermission) => (req, res, next) => {
    try {
      const userRole = req.member.roleId;

      if (!userRole) {
        return next(
          new ApiError(
            HTTP_STATUS.FORBIDDEN,
            "Access denied. No role assigned.",
          ),
        );
      }

      // Check if the permission string exists in the cached array
      if (!userRole.permissions.includes(requiredPermission)) {
        return next(
          new ApiError(
            HTTP_STATUS.FORBIDDEN,
            "Access denied. You do not have permission to perform this action.",
          ),
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequiredPermissions;
