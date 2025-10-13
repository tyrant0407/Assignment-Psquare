import { User } from "../models/User.js";

export async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("Email already in use");
    err.status = 409;
    throw err;
  }
  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash });
  return user;
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }
  const ok = await user.comparePassword(password);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }
  return user;
}
