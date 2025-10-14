import api from "./axiosInstance";

// Booking API endpoints
export const getBookings = (params = {}) => api.get("/api/bookings", { params });
export const getBookingById = (id) => api.get(`/api/bookings/${id}`);
export const createBooking = (data) => api.post("/api/bookings", data);
export const updateBooking = (id, data) => api.put(`/api/bookings/${id}`, data);
export const cancelBooking = (id) => api.delete(`/api/bookings/${id}`);
export const getUserBookings = (userId) => api.get(`/api/bookings/user/${userId}`);