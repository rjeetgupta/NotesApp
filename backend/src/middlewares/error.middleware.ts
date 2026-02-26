import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { envConfig } from "../config/env.config";

const globalErrorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    if (error instanceof ApiError) {
        res.status(error.statusCode).json(error.toJSON());
        return;
    }

    // Zod validation error
    if (error instanceof ZodError) {
        const errors = error.issues.map(
            (issue) => `${issue.path.join(".")}: ${issue.message}`,
        );

        res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Validation failed",
            errors,
        });
        return;
    }

    // Mongoose duplicate key error
    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: number }).code === 11000
    ) {
        res.status(409).json({
            statusCode: 409,
            success: false,
            message: "Duplicate key error",
            errors: ["A record with this value already exists"],
        });
        return;
    }

    // Mongoose CastError (invalid ObjectId)
    if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        (error as { name: string }).name === "CastError"
    ) {
        res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Invalid ID format",
            errors: ["Provided ID is not a valid MongoDB ObjectId"],
        });
        return;
    }

    // Generic / unknown error
    const errorMessage =
        error instanceof Error ? error.message : "Internal server error";

    const errorStack =
        envConfig.isDevelopment() && error instanceof Error
            ? error.stack
            : undefined;

    console.error("Unhandled error:", error);

    res.status(500).json({
        statusCode: 500,
        success: false,
        message: envConfig.isDevelopment()
            ? errorMessage
            : "Internal server error",
        errors: [],
        ...(errorStack && { stack: errorStack }),
    });
};

export { globalErrorHandler };
