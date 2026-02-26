import express, { type Application } from "express";
import cors from "cors";
import { envConfig } from "./config/env.config";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";


const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
        origin: envConfig.CORS_ORIGIN,
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }),
);

app.use(notFoundHandler);
app.use(globalErrorHandler);
export default app;