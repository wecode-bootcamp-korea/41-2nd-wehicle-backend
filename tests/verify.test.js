const request = require("supertest");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const VerifyFixture = require("./fixtures/verify-fixture");
const { createApp } = require("../app");
const { appDataSource } = require("../src/models/appDataSource");

describe("VERIFY API", () => {
  let app;
  const accessToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRETKEY, {
    algorithm: process.env.ALGORITHM,
    expiresIn: "1m",
  });

  const verifyPhoneNumber = "010000000000";
  const verifyCode = 111111;
  const userId = 1;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();

    await VerifyFixture.createVerify(userId, verifyPhoneNumber, verifyCode);
  });

  afterAll(async () => {
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await appDataSource.query(`TRUNCATE verification_codes;`);
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    await appDataSource.destroy();
  });

  describe("POST VERIFICATION CODE", () => {
    test("SUCCESS:Send verify code", async () => {
      axios.get = jest.fn().mockReturnValue({
        data: {
          requestId: process.env.NAVER_SERVICE_ID,
          requestTime: Date.now(),
          statusCode: 202,
          statusName: "success",
        },
      });

      const response = await request(app)
        .post("/verify")
        .send({ phoneNumber: "01099819942" })
        .set({
          Authorization: accessToken,
        });

      expect(axios.get).not.toHaveBeenCalled();
      expect(response.status).toEqual(201);
      expect(response.body).toEqual({ message: "SEND_SUCCESS" });
    });

    test("FAILED:verify Code", async () => {
      const response = await request(app)
        .post("/verify")
        .set({
          Authorization: accessToken,
        })
        .send({ code: 222222 });

      expect(response.status).toEqual(500);
      expect({ message: "인증번호가 틀립니다" });
    });

    test("SUCCESS:verify Code", async () => {
      const response = await request(app)
        .post("/verify/code")
        .set({
          Authorization: accessToken,
        })
        .send({ code: 111111 });

      expect(response.status).toEqual(201);
      expect({ message: "VERIFICATION_SUCCESS" });
    });
  });
});
