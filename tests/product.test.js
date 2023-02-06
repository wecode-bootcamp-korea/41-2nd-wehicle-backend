const request = require("supertest");
const jwt = require("jsonwebtoken");

const ProductFixture = require("./fixtures/product-fixture");
const OrderFixture = require("./fixtures/order-fixture");
const BiddingFixture = require("./fixtures/bidding-fixture");
const { createApp } = require("../app");
const { appDataSource } = require("../src/models/appDataSource");

describe("PRODUCT API", () => {
  let app;

  describe("PRODUCTS LIST API", () => {
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
        car_id: 1,
        thumbnail: "test2.url",
        oil: "diesel",
        year: 2022,
        mileage: 2000,
        price: 20000000,
        inspection_date: 20220101,
      },
      {
        user_id: 2,
        car_id: 1,
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
        product_id: 1,
        delivery_date: "20220202",
        order_status_id: 2,
        deal_price: 40000000,
      },
      {
        bidding_id: 5,
        product_id: 3,
        delivery_date: "20220202",
        order_status_id: 2,
        deal_price: 30000000,
      },
      {
        bidding_id: 6,
        product_id: 2,
        delivery_date: "20220202",
        order_status_id: 3,
        deal_price: 50000000,
      },
    ];

    beforeAll(async () => {
      app = createApp();
      await appDataSource.initialize();
      await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 0;`);

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

  describe("PRODUCT DETAIL API", () => {
    const productArr = [
      {
        user_id: 1,
        car_id: 1,
        thumbnail: "test1.url",
        oil: "gasoline",
        year: 2021,
        mileage: 1000,
        price: 50000000,
        inspection_date: 20210101,
      },
      {
        user_id: 2,
        car_id: 1,
        thumbnail: "test2.url",
        oil: "diesel",
        year: 2022,
        mileage: 2000,
        price: 20000000,
        inspection_date: 20220101,
      },
      {
        user_id: 3,
        car_id: 1,
        thumbnail: "test3.url",
        oil: "gasoline",
        year: 2023,
        mileage: 3000,
        price: 30000000,
        inspection_date: 20230101,
      },
      {
        user_id: 4,
        car_id: 1,
        thumbnail: "test4.url",
        oil: "gasoline",
        year: 2020,
        mileage: 3000,
        price: 30000000,
        inspection_date: 20200101,
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
        user_id: 1,
        product_id: 1,
        price: 100000,
      },
      {
        user_id: 2,
        product_id: 1,
        price: 200000,
      },
      {
        user_id: 3,
        product_id: 1,
        price: 150000,
      },
      {
        user_id: 4,
        product_id: 2,
        price: 300000,
      },
      {
        user_id: 5,
        product_id: 3,
        price: 350000,
      },
      {
        user_id: 6,
        product_id: 4,
        price: 280000,
      },
    ];

    const orderArr = [
      {
        bidding_id: 4,
        delivery_date: "20220202",
        order_status_id: 2,
        deal_price: 40000000,
        created_at: "20230101",
      },
      {
        bidding_id: 5,
        delivery_date: "20220202",
        order_status_id: 2,
        deal_price: 30000000,
        created_at: "20230202",
      },
      {
        bidding_id: 6,
        delivery_date: "20220202",
        order_status_id: 3,
        deal_price: 50000000,
        created_at: "20210909",
      },
    ];

    beforeAll(async () => {
      app = createApp();
      await appDataSource.initialize();
      await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 0;`);

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

    test("SUCCESS: PRODUCT DETAIL", async () => {
      const response = await request(app).get("/products/1");

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        data: {
          productDetail: {
            id: 1,
            brandName: "현대",
            carId: 1,
            sellingPrice: "50000000.000",
            carName: "그랜저",
            year: 2021,
            mileage: 1000,
            thumbnail: "test1.url",
            images: ["image1.url", "image2.url", "image3.url"],
            options: [
              {
                backcamera: 1,
                coolingseat: 1,
                heatingseat: 0,
                leatherseat: 1,
                navi: 1,
                parkingsensor: 0,
                smartkey: 0,
                sunroof: 1,
              },
            ],
            biddingPrice: [200000, 150000, 100000],
          },
          productMarketPrice: [
            {
              id: 1,
              data: [
                { x: "2023/01/01", y: 40000000 },
                { x: "2023/02/02", y: 30000000 },
                { x: "2021/09/09", y: 50000000 },
              ],
            },
          ],
        },
      });
    });

    test("SUCCESS: PRODUCT DETAIL AND FILTERED MARKET PRICE BY PERIOD", async () => {
      const response = await request(app)
        .get("/products/1")
        .query({ period: 1 });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        data: {
          productDetail: {
            id: 1,
            brandName: "현대",
            carId: 1,
            sellingPrice: "50000000.000",
            carName: "그랜저",
            year: 2021,
            mileage: 1000,
            thumbnail: "test1.url",
            images: ["image1.url", "image2.url", "image3.url"],
            options: [
              {
                navi: 1,
                sunroof: 1,
                smartkey: 0,
                backcamera: 1,
                coolingseat: 1,
                heatingseat: 0,
                leatherseat: 1,
                parkingsensor: 0,
              },
            ],
            biddingPrice: [200000, 150000, 100000],
          },

          productMarketPrice: [
            {
              id: 1,
              data: [{ x: "2023/02/02", y: 30000000 }],
            },
          ],
        },
      });
    });

    test("SUCCESS: PRODUCT DETAIL AND FILTERED MARKET PRICE BY YEAR", async () => {
      const response = await request(app)
        .get("/products/1")
        .query({ year: 2023 });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        data: {
          productDetail: {
            id: 1,
            brandName: "현대",
            carId: 1,
            sellingPrice: "50000000.000",
            carName: "그랜저",
            year: 2021,
            mileage: 1000,
            thumbnail: "test1.url",
            images: ["image1.url", "image2.url", "image3.url"],
            options: [
              {
                navi: 1,
                sunroof: 1,
                smartkey: 0,
                backcamera: 1,
                coolingseat: 1,
                heatingseat: 0,
                leatherseat: 1,
                parkingsensor: 0,
              },
            ],
            biddingPrice: [200000, 150000, 100000],
          },

          productMarketPrice: [
            {
              id: 1,
              data: [{ x: "2023/02/02", y: 30000000 }],
            },
          ],
        },
      });
    });

    test("SUCCESS: PRODUCT DETAIL AND FILTERED MARKET PRICE BY YEAR AND PERIOD", async () => {
      const response = await request(app)
        .get("/products/1")
        .query({ period: 3, year: 2023 });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        data: {
          productDetail: {
            id: 1,
            brandName: "현대",
            carId: 1,
            sellingPrice: "50000000.000",
            carName: "그랜저",
            year: 2021,
            mileage: 1000,
            thumbnail: "test1.url",
            images: ["image1.url", "image2.url", "image3.url"],
            options: [
              {
                navi: 1,
                sunroof: 1,
                smartkey: 0,
                backcamera: 1,
                coolingseat: 1,
                heatingseat: 0,
                leatherseat: 1,
                parkingsensor: 0,
              },
            ],
            biddingPrice: [200000, 150000, 100000],
          },

          productMarketPrice: [
            {
              id: 1,
              data: [{ x: "2023/02/02", y: 30000000 }],
            },
          ],
        },
      });
    });
  });
});
