const express = require("express");
const router = express.Router();
const { validateToken } = require("../utils/auth");

const verifyController = require("../controllers/verifyController");

router.post("", validateToken, verifyController.sendVerifyCode);
router.post("/code", validateToken, verifyController.verificationCode);

module.exports = { router };
