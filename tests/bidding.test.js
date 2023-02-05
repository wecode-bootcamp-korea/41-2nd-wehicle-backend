const request = require("supertest");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const CarFixture = require("./fixtures/car-fixture");
const ProductFixture = require("./fixtures/product-fixture");
const OrderFixture = require("./fixtures/order-fixture");
const BiddingFixture = require("./fixtures/bidding-fixture");

const { createApp } = require("../app");
const { appDataSource } = require("../src/models/appDataSource");

describe("BID AND SELL HISTORY", () => {
  const accessToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRETKEY, {
    algorithm: process.env.ALGORITHM,
    expiresIn: "1m",
  });

  const accessToken2 = jwt.sign({ userId: 2 }, process.env.JWT_SECRETKEY, {
    algorithm: process.env.ALGORITHM,
    expiresIn: "1m",
  });

  const brandArr = [
    {
      name: "브랜드1",
    },
  ];

  const carArr = [
    {
      brand_id: 1,
      name: "차2",
      thumbnail: "test1.url",
      size: 1,
      type: 2,
    },
    {
      brand_id: 1,
      name: "차1",
      thumbnail: "test2.url",
      size: 2,
      type: 2,
    },
    {
      brand_id: 1,
      name: "차3",
      thumbnail: "test3.url",
      size: 3,
      type: 1,
    },
  ];

  const productArr = [
    {
      user_id: 2,
      car_id: 1,
      thumbnail: "testP1.url",
      oil: "gasoline",
      year: 2023,
      mileage: 1000,
      price: 1000,
      inspection_date: 20201111,
    },
    {
      user_id: 2,
      car_id: 1,
      thumbnail: "testP2.url",
      oil: "diesel",
      year: 2022,
      mileage: 2000,
      price: 2000,
      inspection_date: 20220101,
    },
    {
      user_id: 2,
      car_id: 1,
      thumbnail: "testP3.url",
      oil: "gasoline",
      year: 2010,
      mileage: 3000,
      price: 2000,
      inspection_date: 20220202,
    },
  ];

  const biddingArr = [
    {
      user_id: 1,
      product_id: 1,
      price: 900,
    },
    {
      user_id: 1,
      product_id: 2,
      price: 1800,
    },
    {
      user_id: 1,
      product_id: 3,
      price: 1900,
    },
    {
      user_id: 3,
      product_id: 2,
      price: 2500,
    },
  ];

  const orderArr = [
    {
      bidding_id: 4,
      user_id: 3,
      product_id: 2,
      deal_price: 2500,
      delivery_date: "20220202",
      order_status_id: 3,
      created_at: "20220202",
    },
    {
      bidding_id: 3,
      user_id: 1,
      product_id: 3,
      deal_price: 2500,
      delivery_date: "20220202",
      order_status_id: 3,
      created_at: "20220202",
    },
  ];

  const paymentArr = [
    {
      user_id: 1,
      order_id: 2,
      method_id: 1,
      coupon_id: 1,
      total_price: 2500,
    },
  ];

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await CarFixture.createBrands(brandArr);
    await CarFixture.createCars(carArr);
    await ProductFixture.createProduct(productArr);
    await BiddingFixture.createBidding(biddingArr);
    await OrderFixture.createOrder(orderArr);
    await OrderFixture.createPayment(paymentArr);
  });

  afterAll(async () => {
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await appDataSource.query(`TRUNCATE brands;`);
    await appDataSource.query(`TRUNCATE cars;`);
    await appDataSource.query(`TRUNCATE products;`);
    await appDataSource.query(`TRUNCATE biddings;`);
    await appDataSource.query(`TRUNCATE orders;`);
    await appDataSource.query(`TRUNCATE payments;`);
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    await appDataSource.destroy();
  });

  describe("GET BID HISTORY", () => {
    test("FAILED: MISSING_ACCESS_TOKEN", async () => {
      const response = await request(app).get("/bidding/bid");

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_ACCESS_TOKEN" });
    });

    test("SUCCESS: GET BID HISTORY", async () => {
      const response = await request(app)
        .get("/bidding/bid")
        .set({ Authorization: accessToken });

      expect(response.status).toEqual(200);
      expect(response.body.bidHistory).toEqual({
        biddingHistory: [
          {
            bidPrice: "900.000",
            biddingId: 1,
            brandName: "브랜드1",
            carName: "차2",
            productId: 1,
            sellPrice: "1000.000",
            thumbnail: "testP1.url",
          },
        ],
        failedBidHistory: [
          {
            bidPrice: "1800.000",
            biddingId: 2,
            brandName: "브랜드1",
            carName: "차2",
            productId: 2,
            sellPrice: "2000.000",
            thumbnail: "testP2.url",
          },
        ],
        purchasedHistory: [
          {
            brandName: "브랜드1",
            carName: "차2",
            finalPrice: "2500.000",
            orderId: 2,
            productId: 3,
            thumbnail: "testP3.url",
          },
        ],
      });
    });
  });

  describe("GET SELL HISTORY", () => {
    test("FAILED: MISSING_ACCESS_TOKEN", async () => {
      const response = await request(app).get("/bidding/sell");

      expect(response.status).toEqual(400);
      expect({ message: "MISSING_ACCESS_TOKEN" });
    });

    test("SUCESS: GET SELL HISTORY", async () => {
      const response = await request(app)
        .get("/bidding/sell")
        .set({ Authorization: accessToken2 });

      expect(response.status).toEqual(200);
      expect(response.body.sellHistory).toEqual({
        onSaleHistory: [
          {
            brandName: "브랜드1",
            carName: "차2",
            productId: 1,
            sellingPrice: "1000.000",
            thumbnail: "testP1.url",
          },
        ],
        soldOutHistory: [
          {
            brandName: "브랜드1",
            carName: "차2",
            finalPrice: "2500.000",
            productId: 2,
            thumbnail: "testP2.url",
          },
          {
            brandName: "브랜드1",
            carName: "차2",
            finalPrice: "2500.000",
            productId: 3,
            thumbnail: "testP3.url",
          },
        ],
      });
    });
  });
});

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
