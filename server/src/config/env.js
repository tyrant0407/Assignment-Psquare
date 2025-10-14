import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/mern_trips",
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "change_this_access_secret",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || "change_this_refresh_secret",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },
  cookies: {
    secure: String(process.env.COOKIE_SECURE || "false") === "true",
    domain: process.env.COOKIE_DOMAIN || undefined,
    sameSite: "lax",
  },
};
