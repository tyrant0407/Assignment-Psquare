import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { createError } from '../utils/error.js';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(createError(401, 'Access token required'));
    }

    const decoded = jwt.verify(token, env.jwt.secret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(createError(401, 'Invalid token'));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(createError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(createError(401, 'Token expired'));
    }
    next(error);
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(createError(403, 'Admin access required'));
  }
  next();
};