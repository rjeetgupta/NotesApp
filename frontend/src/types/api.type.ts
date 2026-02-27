export interface IApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
}

export interface IApiError {
    statusCode: number;
    success: false;
    message: string;
    errors: string[];
}