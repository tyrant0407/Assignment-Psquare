import app from "./app.js";
import { env } from "./config/env.js";
import { connectToDatabase } from "./db/mongoose.js";
import { logger } from "./utils/logger.js";

async function start() {
  try {
    await connectToDatabase();
    app.listen(env.port, () => {
      logger.info(`Server running on http://localhost:${env.port}`);
    });
  } catch (err) {
    logger.error(err, "Failed to start server");
    process.exit(1);
  }
}

start();
