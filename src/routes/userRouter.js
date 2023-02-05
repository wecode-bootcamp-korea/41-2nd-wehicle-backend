const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { validateToken } = require("../utils/auth");

router.get("", validateToken, userController.getUserData);
router.post("/login", userController.kakaoLogin);
router.patch("", validateToken, userController.updateUserInfo);

module.exports = {
  router,
};
