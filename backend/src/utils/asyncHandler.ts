import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * asyncHandler — Higher-Order Function
 *
 * Wraps an async Express route handler and automatically forwards
 * any thrown error to Express's global error-handling middleware
 * via next(error), eliminating repetitive try/catch in every controller.
 */
const asyncHandler = (
    requestHandler: (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => Promise<void | Response>,
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(requestHandler(req, res, next)).catch(
            (error: unknown) => {
                next(error);
            },
        );
    };
};

export { asyncHandler };
