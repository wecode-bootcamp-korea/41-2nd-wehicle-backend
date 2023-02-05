const userService = require("../services/userService");
const { asyncErrorHandler, throwCustomError } = require("../utils/error");

const kakaoLogin = asyncErrorHandler(async (req, res) => {
  const authCode = req.query.code;

  if (!authCode) throwCustomError("MISSING_AUTH_CODE", 400);

  const accessToken = await userService.kakaoLogin(authCode);

  return res.status(200).json({ accessToken });
});

const getUserData = asyncErrorHandler(async (req, res) => {
  const userData = await userService.getUserData(req.userId);
  return res.status(200).json({ userData });
});

const updateUserInfo = asyncErrorHandler(async (req, res) => {
  const { address, phoneNumber } = req.body;

  await userService.updateUserInfo(req.userId, address, phoneNumber);
  return res.status(201).json({ message: "UserInfoUpdated!" });
});

module.exports = {
  kakaoLogin,
  getUserData,
  updateUserInfo,
};
