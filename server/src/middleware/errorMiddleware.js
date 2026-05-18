export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(error, req, res, next) {
  const statusCode = res.statusCode === 200 ? error.statusCode || 500 : res.statusCode;
  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }
  res.status(statusCode).json({
    message: error.message || 'Server error',
    ...(process.env.NODE_ENV !== 'production' ? { stack: error.stack } : {})
  });
}
