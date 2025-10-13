// Centralized error handler
export function notFound(req, res, next) {
  res.status(404).json({ success: false, message: "Not Found" });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ success: false, message });
}
