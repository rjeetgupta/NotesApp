import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

const notFoundHandler = (
    req: Request,
    _res: Response,
    next: NextFunction,
): void => {
    next(
        ApiError.notFound(
            `Route '${req.method} ${req.originalUrl}' does not exist`,
        ),
    );
};

export { notFoundHandler };