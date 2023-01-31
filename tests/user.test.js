const axios = require("axios");
const request = require("supertest");

const { createApp } = require("../app");
const { appDataSource } = require("../src/models/appDataSource");

jest.mock("axios");

describe("Kakao Login", () => {
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
