import mongoose from "mongoose";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

mongoose.set("strictQuery", true);

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose;
  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== "production",
  }).then(() => {
    logger.info("Connected to database");
  }).catch((err) => {
    logger.error(err, "Failed to connect to database");
  });
  return mongoose;
}

export async function disconnectFromDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
