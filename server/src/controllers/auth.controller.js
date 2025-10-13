import Joi from "joi";
import { registerUser, loginUser } from "../services/auth.service.js";
import {
  setAuthCookies,
  clearAuthCookies,
  refreshTokens,
} from "../middlewares/auth.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

export const schemas = {
  register: Joi.object({
    body: Joi.object({
      name: Joi.string().min(2).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  }),
  login: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  }),
};

export async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);
    setAuthCookies(
      res,
      { userId: user._id, role: user.role, tokenVersion: user.tokenVersion },
      env.cookies
    );
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const user = await loginUser(req.body);
    setAuthCookies(
      res,
      { userId: user._id, role: user.role, tokenVersion: user.tokenVersion },
      env.cookies
    );
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  clearAuthCookies(res, env.cookies);
  res.json({ success: true });
}

export async function refresh(req, res) {
  await refreshTokens(req, res);
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -tokenVersion').lean();
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}
