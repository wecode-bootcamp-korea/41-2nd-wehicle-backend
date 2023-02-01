const request = require("supertest");

const ProductFixture = require("./fixtures/product-fixture");
const OrderFixture = require("./fixtures/order-fixture");
const BiddingFixture = require("./fixtures/bidding-fixture");
const { createApp } = require("../app");
const { appDataSource } = require("../src/models/appDataSource");

describe("PRODUCT API", () => {
  let app;

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
  const imageArr = [
    {
      image_url: "image1.url",
      product_id: 1,
    },
    {
      image_url: "image2.url",
      product_id: 1,
    },
    {
      image_url: "image3.url",
      product_id: 1,
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

  const orderArr = [
    {
      bidding_id: 4,
      delivery_date: "20220202",
      order_status_id: 2,
      deal_price: 40000000,
    },
    {
      bidding_id: 5,
      delivery_date: "20220202",
      order_status_id: 2,
      deal_price: 30000000,
    },
    {
      bidding_id: 6,
      delivery_date: "20220202",
      order_status_id: 3,
      deal_price: 50000000,
    },
  ];

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();

    await ProductFixture.createProduct(productArr);
    await ProductFixture.createProductOption(optionArr);
    await ProductFixture.createProductImage(imageArr);
    await BiddingFixture.createBidding(biddingArr);
    await OrderFixture.createOrder(orderArr);
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

  describe("PRODUCTS LIST", () => {
    test("SUCCESS: Get Products list By Filtering Option!", async () => {
      const response = await request(app)
        .get("/products")
        .query({ sunroof: 1 });

      expect(response.status).toEqual(200);
      expect(response.body.data).toHaveLength(4);
    });

    test("SUCCESS: Get Products List By Filtering Brands!", async () => {
      const response = await request(app).get("/products").query({ brand: 1 });

      expect(response.status).toEqual(200);
      expect(response.body.data).toHaveLength(5);
    });

    test("SUCCESS: Get Full Products List!", async () => {
      const response = await request(app).get("/products");

      expect(response.status).toEqual(200);
      expect(response.body.data).toHaveLength(5);
    });

    test("SUCCESS: Sort Products In a Cheap Order!", async () => {
      const response = await request(app)
        .get("/products")
        .query({ sort: "cheap" });

      expect(response.status).toEqual(200);
      expect(response.body.data).toHaveLength(5);
    });

    test("SUCCESS: Invoke The List Of Products As Many As You Want!", async () => {
      const response = await request(app)
        .get("/products")
        .query({ offset: 0, limit: 2 });

      expect(response.status).toEqual(200);
      expect(response.body.data).toHaveLength(2);
    });

    test("SUCCESS: Product Inquiry After Mileage Setting!", async () => {
      const response = await request(app)
        .get("/products")
        .query({ minMileage: 1, maxMileage: 2000 });

      expect(response.status).toEqual(200);
      expect(response.body.data).toHaveLength(4);
    });

    test("SUCCESS: Product Inquiry After Price Setting!", async () => {
      const response = await request(app)
        .get("/products")
        .query({ minPrice: 1, maxPrice: 40000000 });

      expect(response.status).toEqual(200);
      expect(response.body.data).toHaveLength(2);
    });

    test("SUCCESS: No Items Detected!", async () => {
      const response = await request(app)
        .get("/products")
        .query({ brand: 1, minYear: 1000, maxYear: 1001 });

      expect(response.status).toEqual(200);
      expect(response.body.data).toHaveLength(0);
    });
  });
});
