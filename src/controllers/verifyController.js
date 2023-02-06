const verifyService = require("../services/verifyService");
const cryptoJS = require("crypto-js");
const { asyncErrorHandler } = require("../utils/error");

const sendVerifyCode = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const { phoneNumber } = req.body;
  const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;

  const date = Date.now().toString();
  const secretKey = process.env.NAVER_SECRET_KEY;
  const accessKey = process.env.NAVER_ACCESS_KEY;
  const method = "POST";
  const space = " ";
  const newLine = "\n";
  const url = `/sms/v2/services/${process.env.NAVER_SERVICE_ID}/messages`;
  const wehicle = cryptoJS.algo.HMAC.create(cryptoJS.algo.SHA256, secretKey);

  wehicle.update(method);
  wehicle.update(space);
  wehicle.update(url);
  wehicle.update(newLine);
  wehicle.update(date);
  wehicle.update(newLine);
  wehicle.update(accessKey);

  const hash = wehicle.finalize();
  const signature = hash.toString(cryptoJS.enc.Base64);
  await verifyService.sendVerifyCode(
    phoneNumber,
    signature,
    verifyCode,
    date,
    userId
  );

  return res.status(201).json({ message: "SEND_SUCCESS" });
});

const verificationCode = asyncErrorHandler(async (req, res) => {
  const { code } = req.body;
  await verifyService.verificationCode(code);
  return res.status(201).json({ message: "VERIFICATION_SUCCESS" });
});

module.exports = {
  sendVerifyCode,
  verificationCode,
};
