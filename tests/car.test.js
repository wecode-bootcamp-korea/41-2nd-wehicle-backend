const request = require("supertest");

const { createApp } = require("../app");
const { appDataSource } = require("../src/models/appDataSource");
const CarFixture = require("./fixtures/car-fixture");
const ProductFixture = require("./fixtures/product-fixture");

describe("CAR API", () => {
  let app;

  const carArr = [
    {
      brand_id: 1,
      name: "코나",
      thumbnail: "test1.url",
      size: 1,
      type: 2,
    },
    {
      brand_id: 1,
      name: "투싼",
      thumbnail: "test2.url",
      size: 2,
      type: 2,
    },
    {
      brand_id: 2,
      name: "k5",
      thumbnail: "test3.url",
      size: 3,
      type: 1,
    },
    {
      brand_id: 2,
      name: "k3",
      thumbnail: "test4.url",
      size: 2,
      type: 1,
    },
  ];

  const brandArr = [
    {
      name: "현대",
    },
    {
      name: "기아",
    },
    {
      name: "BMW",
    },
    {
      name: "벤츠",
    },
    {
      name: "아우디",
    },
  ];
  const productArr = [
    {
      user_id: 1,
      car_id: 1,
      thumbnail: "test1.url",
      oil: "gasoline",
      year: 2023,
      mileage: 1000,
      price: 50000000,
      inspection_date: 20201111,
    },
    {
      user_id: 1,
      car_id: 2,
      thumbnail: "test2.url",
      oil: "diesel",
      year: 2022,
      mileage: 2000,
      price: 20000000,
      inspection_date: 20220101,
    },
    {
      user_id: 1,
      car_id: 3,
      thumbnail: "test3.url",
      oil: "gasoline",
      year: 2010,
      mileage: 3000,
      price: 30000000,
      inspection_date: 19991111,
    },
  ];

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 0;`);

    await CarFixture.createBrands(brandArr);
    await CarFixture.createCars(carArr);
    await ProductFixture.createProduct(productArr);
  });

  afterAll(async () => {
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 0;`);

    await appDataSource.query(`TRUNCATE brands`);
    await appDataSource.query(`TRUNCATE cars`);
    await appDataSource.query(`TRUNCATE products`);
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    await appDataSource.destroy();
  });

  describe("PRODUCTS LIST", () => {
    test("SUCCESS: Get Cars list By Filtering Option!", async () => {
      const response = await request(app).get("/cars").query({ brand: 2 });

      expect(response.status).toEqual(200);
      expect(response.body.data).toHaveLength(2);
    });
  });
  test("SUCCESS: Get Cars list By Search!", async () => {
    const response = await request(app)
      .get("/cars/search")
      .send({ keyword: "k5" });

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(1);
  });
});
