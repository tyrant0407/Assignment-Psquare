import api from "./axiosInstance";

export const loginRequest = (data) => api.post("/api/auth/login", data);
export const registerRequest = (data) => api.post("/api/auth/register", data);
export const logoutRequest = () => api.post("/api/auth/logout");
export const meRequest = () => api.get("/api/auth/me");
