import api from "./axiosInstance";

// Trip API endpoints
export const getTrips = (params = {}) => api.get("/api/trips", { params });
export const getTripById = (id) => api.get(`/api/trips/${id}`);
export const searchTrips = (searchParams) => api.get("/api/trips/search", { params: searchParams });

// Admin trip endpoints
export const createTrip = (data) => api.post("/api/admin/trips", data);
export const updateTrip = (id, data) => api.patch(`/api/admin/trips/${id}`, data);
export const deleteTrip = (id) => api.delete(`/api/admin/trips/${id}`);