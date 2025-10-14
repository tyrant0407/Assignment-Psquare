import api from "./axiosInstance";

// Admin API endpoints
export const getUsers = (params = {}) => api.get("/api/admin/users", { params });
export const getUserById = (id) => api.get(`/api/admin/users/${id}`);
export const updateUser = (id, data) => api.put(`/api/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/api/admin/users/${id}`);
export const getDashboardStats = () => api.get("/api/admin/dashboard");
export const getSystemLogs = (params = {}) => api.get("/api/admin/logs", { params });