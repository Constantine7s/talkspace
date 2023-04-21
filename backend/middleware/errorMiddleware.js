const notFound = (req, res, next) => {
  const err = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(err);
};

const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message,
  });
};

module.exports = {notFound, errorHandler}