// import HTTP_STATUS from "../constants/http-status.constant.js";
// import ApiError from "../errors/ApiError.js";
// import { getUserById } from "../modules/user/user.repository.js";

// export const requireOrgCreationAccess = async (req, res, next) => {
// try {
//   const user = await getUserById(req.user.id);

//   // If they were invited AND they don't have the special override permission, block them.
//   if (user.isInvited && !user.canCreateOrganizations) {
//     return next(
//       new ApiError(
//         HTTP_STATUS.FORBIDDEN,
//         "Invited members cannot create new organizations.",
//       ),
//     );
//   }

//   next();
// } catch (error) {
//   next(error);
// }
// };
