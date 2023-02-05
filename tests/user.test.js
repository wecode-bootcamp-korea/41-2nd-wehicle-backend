const axios = require("axios");
const request = require("supertest");
const jwt = require("jsonwebtoken");

const { createApp } = require("../app");
const { appDataSource } = require("../src/models/appDataSource");

jest.mock("axios");

describe("USER TEST", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
  });

  afterAll(async () => {
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await appDataSource.query(`TRUNCATE users`);
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    await appDataSource.destroy();
  });

  describe("Kakao Login", () => {
    test("FAILED: MISSING_AUTH_CODE", async () => {
      const response = await request(app).post("/users/login");

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_AUTH_CODE" });
    });

    test("FAILED: MISSING_KAKAO_TOKEN", async () => {
      const response = await request(app)
        .post("/users/login")
        .query({ code: "testAuthCode1" });

      expect(response.status).toEqual(400);
      expect({ message: "ERROR_OCCURED_WHILE_ATTEMPING_TO_LOG_IN" });
    });

    test("FAILED: NO_USER_DATA", async () => {
      axios.get = jest.fn().mockReturnValue({
        data: {
          token_type: "bearer",
          refresh_token: "testRefreshToken",
          expires_in: 21599,
          scope: "account_email profile_nickname",
          refresh_token_expires_in: 5183999,
        },
      });

      const response = await request(app)
        .post("/users/login")
        .query({ code: "testAuthCode3" });

      expect(response.status).toEqual(400);
      expect({ message: "ERROR_OCCURED_WHILE_ATTEMPING_TO_LOG_IN" });
    });

    test("SUCCESS: KAKAO_LOGIN", async () => {
      axios.get = jest.fn().mockReturnValue({
        data: {
          id: 123456789,
          properties: {
            nickname: "testNickname",
          },
          kakao_account: {
            email: "test@email.com",
          },
        },
      });

      const response = await request(app)
        .post("/users/login")
        .query({ code: "testAuthCode3" })
        .set({
          Authorization: "Bearer testKakaoToken",
        });

      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty("accessToken");
    });
  });

  describe("MYPAGE", () => {
    const accessToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRETKEY, {
      algorithm: process.env.ALGORITHM,
      expiresIn: "1m",
    });

    describe("GET USER DATA", () => {
      test("FAILED: MISSING_AUTH_CODE", async () => {
        const response = await request(app).get("/users");

        expect(response.status).toEqual(400);
        expect({ message: "MISSING_AUTH_CODE" });
      });

      test("SUCCESS: GET USER DATA", async () => {
        const response = await request(app)
          .get("/users")
          .set({ Authorization: accessToken });

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
          userData: { nickname: "testNickname", points: "100000000.000" },
        });
      });
    });

    describe("UPDATE USER DATA", () => {
      test("FAILED: MISSING_AUTH_CODE", async () => {
        const response = await request(app).patch("/users");

        expect(response.status).toEqual(400);
        expect({ message: "MISSING_AUTH_CODE" });
      });

      test("SUCCESS: UPDATE USER DATA", async () => {
        const response = await request(app)
          .patch("/users")
          .send({ address: "testAddress1", phoneNumber: "01012341234" })
          .set({ Authorization: accessToken });

        expect(response.status).toEqual(201);
        expect({ message: "UserInfoUpdated!" });
      });
    });
  });
});
