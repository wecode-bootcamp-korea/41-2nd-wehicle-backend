const asyncErrorHandler = (func) => {
  return (req, res, next) => {
    func(req, res).catch((error) => next(error));
  };
};

const throwCustomError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;

  throw err;
};

const errorHandler = (err, req, res, next) => {
  return res.status(err.statusCode || 500).json({ message: err.message });
};

module.exports = {
  errorHandler,
  throwCustomError,
  asyncErrorHandler,
};
