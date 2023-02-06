const request = require("supertest");
const jwt = require("jsonwebtoken");

const ProductFixture = require("./fixtures/product-fixture");
const BiddingFixture = require("./fixtures/bidding-fixture");
const { createApp } = require("../app");
const { appDataSource } = require("../src/models/appDataSource");

describe("ORDERS API", () => {
  let app;

  const accessToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRETKEY, {
    algorithm: process.env.ALGORITHM,
    expiresIn: "1m",
  });
  const productArr = [
    {
      user_id: 3,
      car_id: 1,
      thumbnail: "test1.url",
      oil: "gasoline",
      year: 2023,
      mileage: 1000,
      price: 50000000,
      inspection_date: 20201111,
    },
    {
      user_id: 3,
      car_id: 2,
      thumbnail: "test2.url",
      oil: "diesel",
      year: 2022,
      mileage: 2000,
      price: 20000000,
      inspection_date: 20220101,
    },
    {
      user_id: 2,
      car_id: 3,
      thumbnail: "test3.url",
      oil: "gasoline",
      year: 2010,
      mileage: 3000,
      price: 30000000,
      inspection_date: 19991111,
    },
  ];

  const optionArr = [
    {
      product_id: 1,
      color: "black",
      sunroof: 1,
      parkingsensor: 0,
      backcamera: 1,
      navi: 1,
      heatingseat: 0,
      coolingseat: 1,
      smartkey: 0,
      leatherseat: 1,
    },
    {
      product_id: 2,
      color: "white",
      sunroof: 1,
      parkingsensor: 1,
      backcamera: 1,
      navi: 1,
      heatingseat: 0,
      coolingseat: 0,
      smartkey: 0,
      leatherseat: 0,
    },
    {
      product_id: 3,
      color: "black",
      sunroof: 0,
      parkingsensor: 0,
      backcamera: 1,
      navi: 0,
      heatingseat: 0,
      coolingseat: 1,
      smartkey: 0,
      leatherseat: 0,
    },
  ];
  const biddingArr = [
    {
      user_id: 4,
      product_id: 1,
      price: 40000000,
    },
    {
      user_id: 5,
      product_id: 1,
      price: 30000000,
    },
    {
      user_id: 6,
      product_id: 1,
      price: 20000000,
    },
  ];

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();

    await ProductFixture.createProduct(productArr);
    await ProductFixture.createProductOption(optionArr);
    await ProductFixture.createProductImage(imageArr);
    await BiddingFixture.createBidding(biddingArr);
  });

  afterAll(async () => {
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await appDataSource.query(`TRUNCATE products;`);
    await appDataSource.query(`TRUNCATE product_options;`);
    await appDataSource.query(`TRUNCATE product_images;`);
    await appDataSource.query(`TRUNCATE biddings;`);
    await appDataSource.query(`TRUNCATE orders;`);
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    await appDataSource.destroy();
  });

  describe("POST ORDERS", () => {
    test("SUCCESS:Post Order", async () => {
      const response = await request(app)
        .post("/orders")
        .set({
          Authorization: accessToken,
        })
        .query({
          biddingId: 1,
          productId: 50,
          methodId: 5,
          couponId: 1,
          phoneNumber: "01099819942",
          address: "abcd",
          deliveryDate: 20230204,
          dealPrice: 30000000,
          productId: 1,
        });

      expect(response.status).toEqual(201);
    });
    test("SUCCESS:Post Order", async () => {
      const response = await request(app)
        .post("/orders")
        .set({
          Authorization: accessToken,
        })
        .query({
          productId: 50,
          methodId: 5,
          couponId: 1,
          phoneNumber: "01099819942",
          address: "abcd",
          deliveryDate: 20230204,
          dealPrice: 30000000,
          productId: 1,
        });

      expect(response.status).toEqual(201);
      expect({ message: "SUCCESS_ORDER" });
    });
    test("FAILED:Post Order", async () => {
      const response = await request(app)
        .post("/orders")
        .set({
          Authorization: accessToken,
        })
        .query({});

      expect(response.status).toEqual(400);
    });
  });
});
