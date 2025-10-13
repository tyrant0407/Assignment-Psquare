import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { notFound, errorHandler } from "./middlewares/error.js";
import authRoutes from "./routes/auth.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// Security & Parsers
app.use(helmet());
app.use(
  cors({
    origin: env.cors.origin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Rate limiting for auth endpoints (will be mounted later under /api/auth)
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.set("authLimiter", authLimiter);

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

// Routes placeholders (to be mounted later)
app.use("/api/auth", app.get("authLimiter"), authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/admin", adminRoutes);

// 404 and Error handler
app.use(notFound);
app.use(errorHandler);

export default app;
