import ApiError from "../errors/ApiError.js";
import HTTP_STATUS from "../constants/http-status.constant.js";

// check whether the user have particular access permissions or not
const validateRequiredPermissions =
  (requiredPermission) => (req, res, next) => {
    try {
      const userRole = req.member.roleId;
      const member = req.member;
      // console.log(userRole);

      if (!userRole) {
        return next(
          new ApiError(
            HTTP_STATUS.FORBIDDEN,
            "Access denied. No role assigned.",
          ),
        );
      }

      const all_permissions = [...userRole?.permissions];
      if (member.additionalPermissions)
        all_permissions.push(...member.additionalPermissions);
      
      // console.log("req.member", req.member, all_permissions)

      // Check if the permission string exists in the cached array
      if (!all_permissions.includes(requiredPermission)) {
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
