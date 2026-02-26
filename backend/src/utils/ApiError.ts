class ApiError extends Error {
    public readonly statusCode: number;
    public readonly success: boolean;
    public readonly errors: string[];

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: string[] = [],
        stack?: string,
    ) {
        super(message);

        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;

        // Restore prototype chain
        Object.setPrototypeOf(this, new.target.prototype);
        
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    // Static factory helper

    static badRequest(message: string, errors: string[] = []): ApiError {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message: string = "Unauthorized"): ApiError {
        return new ApiError(401, message);
    }

    static forbidden(message: string = "Forbidden"): ApiError {
        return new ApiError(403, message);
    }

    static notFound(message: string = "Resource not found"): ApiError {
        return new ApiError(404, message);
    }

    static conflict(message: string): ApiError {
        return new ApiError(409, message);
    }

    static internalServer(message: string = "Internal server error"): ApiError {
        return new ApiError(500, message);
    }

    // Serialise for JSON response
    public toJSON() {
        return {
            statusCode: this.statusCode,
            success: this.success,
            message: this.message,
            errors: this.errors,
        };
    }
}

export { ApiError };
