const jwt = require("jsonwebtoken");
const axios = require("axios");

const userDao = require("../models/userDao");

const SocialTypeId = Object.freeze({
  KAKAO: 1,
  NAVER: 2,
  GOOGLE: 3,
});

const kakaoLogin = async (authCode) => {
  try {
    const getKakaoToken = await axios.get(
      "https://kauth.kakao.com/oauth/token",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          grant_type: "authorization_code",
          client_id: process.env.KAKAO_REST_API_KEY,
          redirect_url: process.env.KAKAO_REDIRECT_URI,
          code: authCode,
        },
        withCredentials: true,
      }
    );

    const getKakaoUserData = await axios.get(
      "https://kapi.kakao.com/v2/user/me",
      {
        headers: {
          Authorization: `Bearer ${getKakaoToken.data.access_token}`,
        },
      }
    );

    const socialId = getKakaoUserData.data.id;
    const email = getKakaoUserData.data.kakao_account.email;
    const nickname = getKakaoUserData.data.properties.nickname;
    const socialTypeId = SocialTypeId.KAKAO;

    const userInfo = await userDao.getUserInfo(socialId, socialTypeId);

    if (!userInfo) {
      const newUser = await userDao.createUser(
        socialId,
        email,
        nickname,
        socialTypeId
      );

      const accessToken = jwt.sign(
        { userId: newUser.insertId },
        process.env.JWT_SECRETKEY,
        {
          algorithm: process.env.ALGORITHM,
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      return accessToken;
    }

    const accessToken = jwt.sign(
      { userId: userInfo.id },
      process.env.JWT_SECRETKEY,
      {
        algorithm: process.env.ALGORITHM,
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return accessToken;
  } catch (err) {
    const error = new Error("ERROR_OCCURED_WHILE_ATTEMPING_TO_LOG_IN");
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  kakaoLogin,
};
