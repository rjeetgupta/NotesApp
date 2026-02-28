import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError";

type ValidateTarget = "body" | "params" | "query";

const validate = (schema: ZodSchema, target: ValidateTarget = "body") => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const readableErrors = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );

      throw ApiError.badRequest("Validation failed", readableErrors);
    }

    next();
  };
};

export { validate };