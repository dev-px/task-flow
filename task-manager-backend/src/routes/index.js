import express from "express";
import v1Routes from "./v1.route.js";

const router = express.Router();

router.use("/v1", v1Routes);

export default router;