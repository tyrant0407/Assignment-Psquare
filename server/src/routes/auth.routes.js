import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import {
  schemas,
  register,
  login,
  logout,
  refresh,
  me,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import rateLimit from "express-rate-limit";

const router = Router();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
router.use(limiter);

router.post("/register", validate(schemas.register), register);
router.post("/login", validate(schemas.login), login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", requireAuth, me);


export default router;
