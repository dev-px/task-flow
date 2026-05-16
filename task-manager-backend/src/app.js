import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import env from "./config/env.config.js";
import { successResponse } from "./utils/api-response.util.js";
import HTTP_STATUS from "./constants/http-status.constant.js";
import cookieParser from "cookie-parser";

const app = express();

if (env.NODE_ENV === "production") {
  app.use(helmet());
}
app.use(cors());
// app.use(
//   cors({
//     origin:
//       process.env.NODE_ENV === "production" ? ["https://yourdomain.com"] : "*",
//     credentials: true,
//   }),
// );
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// to check status of APIs
app.get("/health", (req, res) => {
  successResponse(
    res,
    "API is healthy",
    { uptime: process.uptime() },
    HTTP_STATUS.OK,
  );
});

app.use("/api", router);

// error middleware
app.use(errorMiddleware);

export default app;
