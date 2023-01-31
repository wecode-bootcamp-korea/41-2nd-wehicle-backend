const jwt = require("jsonwebtoken");
const { asyncErrorHandler, throwCustomError } = require("../utils/error");

const validateToken = asyncErrorHandler(async (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) throwCustomError("NEED_ACCESS_TOKEN", 400);

  const decoded = await jwt.verify(accessToken, process.env.JWT_SECRETKEY);

  if (!decoded) throwCustomError("USER_DOES_NOT_EXIST", 404);

  req.userId = decoded.userId;
  next();
});

module.exports = {
  validateToken,
};
