const verifyDao = require("../models/verifyDao");
const axios = require("axios");
const { throwCustomError } = require("../utils/error");

const sendVerifyCode = async (
  phoneNumber,
  signature,
  verifyCode,
  date,
  userId
) => {
  axios({
    method: "POST",
    json: true,
    url: `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.NAVER_SERVICE_ID}/messages`,
    headers: {
      "Content-Type": "application/json",
      "x-ncp-iam-access-key": process.env.NAVER_ACCESS_KEY,
      "x-ncp-apigw-timestamp": date,
      "x-ncp-apigw-signature-v2": signature,
    },
    data: {
      type: "SMS",
      contentType: "COMM",
      countryCode: "82",
      from: process.env.NAVER_FROM_PHONE_NUMBER,
      content: `[WEHICLE] 인증번호 [${verifyCode}]를 입력해주세요.`,
      messages: [
        {
          to: `${phoneNumber}`,
        },
      ],
    },
  });
  return verifyDao.sendVerifyCode(phoneNumber, verifyCode, userId);
};

const verificationCode = async (code) => {
  const result = verifyDao.verificationCode(code);
  if (!result) throwCustomError("인증번호가 틀립니다", 400);
  return result;
};

module.exports = { sendVerifyCode, verificationCode };
