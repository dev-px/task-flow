import express from "express";
import SUCCESS_MESSAGES from "./../errors/success.messages.js";
import { successResponse } from "../utils/api-response.util.js";
import HTTP_STATUS from "./../constants/http-status.constant.js";
import authRoute from "./../modules/auth/auth.route.js";
import userRoute from "./../modules/user/user.route.js";
import organizationRoute from "./../modules/organization/organization.route.js";
import roleRouter from "./../modules/role/role.route.js";
import memberRouter from "./../modules/member/member.route.js";

const router = express.Router();

// define all routes
router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/organizations", organizationRoute);
router.use("/roles", roleRouter);
router.use("/member", memberRouter);
// router.use("/projects", projectRoutes);

// test route
router.get("/test", (req, res) => {
  return successResponse(
    res,
    SUCCESS_MESSAGES.DATA_FETCHED,
    { test: "Checking API" },
    HTTP_STATUS.OK,
  );
});

export default router;
