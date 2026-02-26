import mongoose from "mongoose";
import { envConfig } from "./env.config";

class DatabaseConfig {
    private static instance: DatabaseConfig;
    private isConnected: boolean = false;

    private constructor() {}

    public static getInstance(): DatabaseConfig {
        if (!DatabaseConfig.instance) {
            DatabaseConfig.instance = new DatabaseConfig();
        }
        return DatabaseConfig.instance;
    }

    public async connect(): Promise<void> {
        if (this.isConnected) {
            console.log("MongoDB already connected");
            return;
        }

        try {
            const connection = await mongoose.connect(envConfig.MONGODB_URI, {
                dbName: "notes_app",
            });

            this.isConnected = true;
            console.log(
                `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`,
            );

        } catch (error) {
            console.error("MongoDB connection failed:", error);
            process.exit(1);
        }
    }
}

export const databaseConfig = DatabaseConfig.getInstance();