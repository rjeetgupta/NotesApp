import app from "./app";
import { databaseConfig } from "./config/database.config";
import { envConfig } from "./config/env.config";

const startServer = async (): Promise<void> => {
  try {
    await databaseConfig.connect();
    console.log("Database connected successfully");

    app.listen(envConfig.PORT, () => {
      console.log(`Server running on http://localhost:${envConfig.PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();