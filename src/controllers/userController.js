const userService = require("../services/userService");
const { asyncErrorHandler, throwCustomError } = require("../utils/error");

const kakaoLogin = asyncErrorHandler(async (req, res) => {
  const authCode = req.query.code;

  if (!authCode) throwCustomError("MISSING_AUTH_CODE", 400);

  const accessToken = await userService.kakaoLogin(authCode);

  return res.status(200).json({ accessToken });
});

module.exports = {
  kakaoLogin,
};
