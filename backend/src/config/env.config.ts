import 'dotenv/config'

class EnvConfig {
    public readonly PORT: number;
    public readonly MONGODB_URI: string;
    public readonly NODE_ENV: string;
    public readonly CORS_ORIGIN: string;

    constructor() {
        this.PORT = parseInt(process.env.PORT ?? "8000", 10);
        this.MONGODB_URI =
            process.env.MONGODB_URI ?? "mongodb://localhost:27017/notes_app";
        this.NODE_ENV = process.env.NODE_ENV ?? "development";
        this.CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";
    }

    public isDevelopment(): boolean {
        return this.NODE_ENV === "development";
    }

    public isProduction(): boolean {
        return this.NODE_ENV === "production";
    }
}

export const envConfig = new EnvConfig();