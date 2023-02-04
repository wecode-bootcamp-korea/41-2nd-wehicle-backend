const request = require("supertest");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const { createApp } = require("../app");
const { appDataSource } = require("../src/models/appDataSource");

describe("BIDDING API", () => {
  let app;

  const accessToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRETKEY, {
    algorithm: process.env.ALGORITHM,
    expiresIn: "1m",
  });

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 0;`);
  });

  afterAll(async () => {
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await appDataSource.query(`TRUNCATE biddings;`);
    await appDataSource.query(`TRUNCATE products;`);
    await appDataSource.query(`TRUNCATE product_images;`);
    await appDataSource.query(`TRUNCATE product_options;`);
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    await appDataSource.destroy();
  });

  describe("CREATE BID", () => {
    test("FAILED: MISSING_ACCESS_TOKEN", async () => {
      const response = await request(app)
        .post("/bidding/bid")
        .send({ productId: 1, price: 1000 });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_ACCESS_TOKEN" });
    });

    test("FAILED: MISSING_PRODUCT_ID", async () => {
      const response = await request(app)
        .post("/bidding/bid")
        .set({
          Authorization: accessToken,
        })
        .send({ price: 1000 });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_PRODUCT_ID" });
    });

    test("FAILED: MISSING_BID_PRICE", async () => {
      const response = await request(app)
        .post("/bidding/bid")
        .set({
          Authorization: accessToken,
        })
        .send({ productId: 1 });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_BID_PRICE" });
    });

    test("SUCCESS: CREATE A BID", async () => {
      const response = await request(app)
        .post("/bidding/bid")
        .set({
          Authorization: accessToken,
        })
        .send({ productId: 1, price: 1000 });

      expect(response.status).toEqual(201);
      expect({ message: "BidPriceCreated!" });
    });
  });

  describe("CREATE SELL", () => {
    test("FAILED: MISSING_ACCESS_TOKEN", async () => {
      const response = await request(app)
        .post("/bidding/sell")
        .set("Content-Type", "multipart/form-data")
        .field("price", 100000)
        .field("carId", 1)
        .field("oil", "gasoline")
        .field("year", 2023)
        .field("mileage", 1000)
        .field("inspectionDate", 20230101)
        .field("color", "black")
        .field("sunroof", 1)
        .field("parkingsensor", 1)
        .field("backcamera", 1)
        .field("navi", 1)
        .field("heatingseat", 1)
        .field("coolingseat", 1)
        .field("smartkey", 1)
        .field("leatherseat", 1)
        .field("address", "testAddress")
        .field("phoneNumber", "0101111111")
        .attach("images", `${__dirname}/fixtures/dummy.png`)
        .attach("images", `${__dirname}/fixtures/dummy2.png`);

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_ACCESS_TOKEN" });
    });

    test("FAILED: MISSING_SELL_PRICE", async () => {
      const response = await request(app)
        .post("/bidding/sell")
        .set("Content-Type", "multipart/form-data")
        .field("carId", 1)
        .field("oil", "gasoline")
        .field("year", 2023)
        .field("mileage", 1000)
        .field("inspectionDate", 20230101)
        .field("color", "black")
        .field("sunroof", 1)
        .field("parkingsensor", 1)
        .field("backcamera", 1)
        .field("navi", 1)
        .field("heatingseat", 1)
        .field("coolingseat", 1)
        .field("smartkey", 1)
        .field("leatherseat", 1)
        .field("address", "testAddress")
        .field("phoneNumber", "0101111111")
        .attach("images", `${__dirname}/fixtures/dummy.png`)
        .attach("images", `${__dirname}/fixtures/dummy2.png`)
        .set({ Authorization: accessToken });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_SELL_PRICE" });
    });

    test("FAILED: MISSING_CARID", async () => {
      const response = await request(app)
        .post("/bidding/sell")
        .set("Content-Type", "multipart/form-data")
        .field("price", 100000)
        .field("oil", "gasoline")
        .field("year", 2023)
        .field("mileage", 1000)
        .field("inspectionDate", 20230101)
        .field("color", "black")
        .field("sunroof", 1)
        .field("parkingsensor", 1)
        .field("backcamera", 1)
        .field("navi", 1)
        .field("heatingseat", 1)
        .field("coolingseat", 1)
        .field("smartkey", 1)
        .field("leatherseat", 1)
        .field("address", "testAddress")
        .field("phoneNumber", "0101111111")
        .attach("images", `${__dirname}/fixtures/dummy.png`)
        .attach("images", `${__dirname}/fixtures/dummy2.png`)
        .set({ Authorization: accessToken });

      expect(response.status).toEqual(400);
      expect({ message: "INSUFFICIENT_SELLING_PRODUCT_DETAIL_INFO" });
    });

    test("FAILED: MISSING_SELLING_PRODUCT_DETAIL_INFO", async () => {
      const response = await request(app)
        .post("/bidding/sell")
        .set("Content-Type", "multipart/form-data")
        .field("price", 100000)
        .field("carId", 1)
        .field("oil", "gasoline")
        .field("year", 2023)
        .field("inspectionDate", 20230101)
        .field("color", "black")
        .field("sunroof", 1)
        .field("parkingsensor", 1)
        .field("backcamera", 1)
        .field("navi", 1)
        .field("heatingseat", 1)
        .field("coolingseat", 1)
        .field("smartkey", 1)
        .field("leatherseat", 1)
        .field("address", "testAddress")
        .field("phoneNumber", "0101111111")
        .attach("images", `${__dirname}/fixtures/dummy.png`)
        .attach("images", `${__dirname}/fixtures/dummy2.png`)
        .set({ Authorization: accessToken });

      expect(response.status).toEqual(400);
      expect({ message: "INSUFFICIENT_SELLING_PRODUCT_DETAIL_INFO" });
    });

    test("FAILED: MISSING_SELLING_PRODUCT_OPTIONS_INFO", async () => {
      const response = await request(app)
        .post("/bidding/sell")
        .set("Content-Type", "multipart/form-data")
        .field("price", 100000)
        .field("carId", 1)
        .field("oil", "gasoline")
        .field("year", 2023)
        .field("mileage", 1000)
        .field("inspectionDate", 20230101)
        .field("color", "black")
        .field("parkingsensor", 1)
        .field("backcamera", 1)
        .field("navi", 1)
        .field("heatingseat", 1)
        .field("coolingseat", 1)
        .field("smartkey", 1)
        .field("leatherseat", 1)
        .field("address", "testAddress")
        .field("phoneNumber", "0101111111")
        .attach("images", `${__dirname}/fixtures/dummy.png`)
        .attach("images", `${__dirname}/fixtures/dummy2.png`)
        .set({ Authorization: accessToken });

      expect(response.status).toEqual(400);
      expect({ message: "INSUFFICIENT_SELLING_PRODUCT_OPTIONS_INFO" });
    });

    test("FAILED: MISSING_SELLING_PRODUCT_IMAGES", async () => {
      const response = await request(app)
        .post("/bidding/sell")
        .set("Content-Type", "multipart/form-data")
        .field("price", 100000)
        .field("carId", 1)
        .field("oil", "gasoline")
        .field("year", 2023)
        .field("mileage", 1000)
        .field("inspectionDate", 20230101)
        .field("color", "black")
        .field("sunroof", 1)
        .field("parkingsensor", 1)
        .field("backcamera", 1)
        .field("navi", 1)
        .field("heatingseat", 1)
        .field("coolingseat", 1)
        .field("smartkey", 1)
        .field("leatherseat", 1)
        .field("address", "testAddress")
        .field("phoneNumber", "0101111111")
        .set({ Authorization: accessToken });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_SELLING_PRODUCT_IMAGES" });
    });

    test("FAILED: MISSING_USER_INFO", async () => {
      const response = await request(app)
        .post("/bidding/sell")
        .set("Content-Type", "multipart/form-data")
        .field("price", 100000)
        .field("carId", 1)
        .field("oil", "gasoline")
        .field("year", 2023)
        .field("mileage", 1000)
        .field("inspectionDate", 20230101)
        .field("color", "black")
        .field("sunroof", 1)
        .field("parkingsensor", 1)
        .field("backcamera", 1)
        .field("navi", 1)
        .field("heatingseat", 1)
        .field("coolingseat", 1)
        .field("smartkey", 1)
        .field("leatherseat", 1)
        .field("phoneNumber", "0101111111")
        .attach("images", `${__dirname}/fixtures/dummy.png`)
        .attach("images", `${__dirname}/fixtures/dummy2.png`)
        .set({ Authorization: accessToken });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_USER_INFO" });
    });

    test("SUCCESS: CREATE A SELL PRICE", async () => {
      const response = await request(app)
        .post("/bidding/sell")
        .set("Content-Type", "multipart/form-data")
        .field("price", 100000)
        .field("carId", 1)
        .field("oil", "gasoline")
        .field("year", 2023)
        .field("mileage", 1000)
        .field("inspectionDate", 20230101)
        .field("color", "black")
        .field("sunroof", 1)
        .field("parkingsensor", 1)
        .field("backcamera", 1)
        .field("navi", 1)
        .field("heatingseat", 1)
        .field("coolingseat", 1)
        .field("smartkey", 1)
        .field("leatherseat", 1)
        .field("address", "testAddress")
        .field("phoneNumber", "0101111111")
        .attach("images", `${__dirname}/fixtures/dummy.png`)
        .attach("images", `${__dirname}/fixtures/dummy2.png`)
        .set({ Authorization: accessToken });

      expect(response.status).toEqual(201);
      expect({ message: "SellPriceCreated" });
    });
  });

  describe("UPDATE BID", () => {
    test("FAILED: MISSING_ACCESS_TOKEN", async () => {
      const response = await request(app)
        .patch("/bidding/bid")
        .send({ productId: 1, price: 1000 });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_ACCESS_TOKEN" });
    });

    test("FAILED: MISSING_PRODUCT_ID", async () => {
      const response = await request(app)
        .patch("/bidding/bid")
        .set({
          Authorization: accessToken,
        })
        .send({ price: 1000 });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_UPDATED_BID_INFO" });
    });

    test("FAILED: MISSING_BID_PRICE", async () => {
      const response = await request(app)
        .patch("/bidding/bid")
        .set({
          Authorization: accessToken,
        })
        .send({ productId: 1 });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_UPDATED_BID_INFO" });
    });

    test("SUCCESS: UPDATE A BID", async () => {
      const response = await request(app)
        .patch("/bidding/bid")
        .set({
          Authorization: accessToken,
        })
        .send({ productId: 1, price: 1000 });

      expect(response.status).toEqual(201);
      expect({ message: "BidPriceUpdated!" });
    });
  });

  describe("UPDATE SELL", () => {
    test("FAILED: MISSING_ACCESS_TOKEN", async () => {
      const response = await request(app)
        .patch("/bidding/sell")
        .send({ productId: 1, price: 1000 });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_ACCESS_TOKEN" });
    });

    test("FAILED: MISSING_PRODUCT_ID", async () => {
      const response = await request(app)
        .patch("/bidding/sell")
        .set({
          Authorization: accessToken,
        })
        .send({ price: 1000 });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_UPDATED_SELL_INFO" });
    });

    test("FAILED: MISSING_SELL_PRICE", async () => {
      const response = await request(app)
        .patch("/bidding/sell")
        .set({
          Authorization: accessToken,
        })
        .send({ productId: 1 });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_UPDATED_SELL_INFO" });
    });

    test("SUCCESS: UPDATE A SELL PRICE", async () => {
      const response = await request(app)
        .patch("/bidding/sell")
        .set({
          Authorization: accessToken,
        })
        .send({ productId: 1, price: 1000 });

      expect(response.status).toEqual(201);
      expect({ message: "SellPriceUpdated!" });
    });
  });

  describe("DELETE BID", () => {
    test("FAILED: MISSING_ACCESS_TOKEN", async () => {
      const response = await request(app)
        .delete("/bidding/bid")
        .send({ productId: 1 });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_ACCESS_TOKEN" });
    });

    test("FAILED: MISSING_PRODUCT_ID", async () => {
      const response = await request(app).delete("/bidding/bid").set({
        Authorization: accessToken,
      });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_BID_INFO" });
    });

    test("SUCCESS: DELETE A BID", async () => {
      const response = await request(app)
        .delete("/bidding/bid")
        .set({
          Authorization: accessToken,
        })
        .send({ productId: 1 });

      expect(response.status).toEqual(200);
      expect({ message: "BidDeleted!" });
    });
  });

  describe("DELETE SELL", () => {
    test("FAILED: MISSING_ACCESS_TOKEN", async () => {
      const response = await request(app)
        .delete("/bidding/sell")
        .send({ productId: 1 });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_ACCESS_TOKEN" });
    });

    test("FAILED: MISSING_PRODUCT_ID", async () => {
      const response = await request(app).delete("/bidding/sell").set({
        Authorization: accessToken,
      });

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_SELL_INFO" });
    });

    test("SUCCESS: DELETE A SELLING PRODUCT", async () => {
      const response = await request(app)
        .delete("/bidding/sell")
        .set({
          Authorization: accessToken,
        })
        .send({ productId: 1 });

      expect(response.status).toEqual(200);
      expect({ message: "SellingProductDeleted!" });
    });
  });
});
