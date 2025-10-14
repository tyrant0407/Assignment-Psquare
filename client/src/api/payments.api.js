import api from "./axiosInstance";

// Payment API endpoints
export const processPayment = (paymentData) => api.post("/api/payments/process", paymentData);