class ApiResponse<T = unknown> {
    public readonly statusCode: number;
    public readonly success: boolean;
    public readonly message: string;
    public readonly data: T;
  
    constructor(statusCode: number, data: T, message: string = "Success") {
      this.statusCode = statusCode;
      this.success = statusCode < 400;
      this.message = message;
      this.data = data;
    }
  
    // Static factory helpers
  
    static ok<T>(data: T, message: string = "Success"): ApiResponse<T> {
      return new ApiResponse<T>(200, data, message);
    }
  
    static created<T>(data: T, message: string = "Created successfully"): ApiResponse<T> {
      return new ApiResponse<T>(201, data, message);
    }
  
    static noContent(message: string = "Deleted successfully"): ApiResponse<null> {
      return new ApiResponse<null>(200, null, message);
    }
  
    // Serialise for JSON response
    public toJSON() {
      return {
        statusCode: this.statusCode,
        success: this.success,
        message: this.message,
        data: this.data,
      };
    }
  }
  
  export { ApiResponse };