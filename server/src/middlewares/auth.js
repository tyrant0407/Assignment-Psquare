import {
  verifyAccessToken,
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "../utils/jwt.js";
import { User } from "../models/User.js";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

function cookieOptions({ secure, domain }) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: secure,
    domain: domain,
    path: "/",
  };
}

export function setAuthCookies(res, { userId, role, tokenVersion }, options) {
  const access = signAccessToken({ sub: userId, role, tv: tokenVersion });
  const refresh = signRefreshToken({ sub: userId, role, tv: tokenVersion });
  const opts = cookieOptions(options);
  res.cookie(ACCESS_COOKIE, access, { ...opts });
  res.cookie(REFRESH_COOKIE, refresh, { ...opts });
}

export function clearAuthCookies(res, options) {
  const opts = cookieOptions(options);
  res.clearCookie(ACCESS_COOKIE, opts);
  res.clearCookie(REFRESH_COOKIE, opts);
}

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies[ACCESS_COOKIE];
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role, tv: payload.tv };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  };
}

export async function refreshTokens(req, res) {
  try {
    const token = req.cookies[REFRESH_COOKIE];
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub).lean();
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (user.tokenVersion !== payload.tv) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    setAuthCookies(
      res,
      { userId: user._id, role: user.role, tokenVersion: user.tokenVersion },
      { secure: false }
    );
    return res.json({ success: true });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}

export const authCookieNames = { ACCESS_COOKIE, REFRESH_COOKIE };
