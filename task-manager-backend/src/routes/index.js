import express from "express";
import v1Routes from "./v1.route.js";
import env from "../config/env.config.js";

const router = express.Router();

router.use(`/${env.VERSION}`, v1Routes);

export default router;