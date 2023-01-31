const request = require("supertest");

const { createApp } = require("../app");
const { appDataSource } = require("../src/models/appDataSource");

describe("Get Product List ! ", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
  });

  afterAll(async () => {
    await appDataSource.destroy();
  });

  test("SUCCESS : Get Products list By Filtering Option", async () => {
    await request(app)
      .get("/products")
      .query({
        sunroof: 1,
        parkingSensor: 1,
        backCamera: 1,
        navi: 1,
        heatingSeat: 1,
        coolingSeat: 1,
        smartKey: 1,
        leatherSeat: 1,
        brand: 1,
      })
      .expect(200)
      .expect({
        data: [
          {
            carId: 2,
            carName: "그랜져",
            mainThumbnailImage: "test2.url",
            type: "1",
            price: "22222222.000",
            listThumbnailImage: "test2.uri",
            brandName: "현대",
          },
        ],
      });
  });
  test("SUCCESS : Get Products List By Filtering Brands", async () => {
    await request(app)
      .get("/products")
      .query({ brand: 1 })
      .expect(200)
      .expect({
        data: [
          {
            carId: 2,
            carName: "그랜져",
            mainThumbnailImage: "test2.url",
            type: "1",
            price: "22222222.000",
            listThumbnailImage: "test2.uri",
            brandName: "현대",
          },
          {
            carId: 1,
            carName: "코나",
            mainThumbnailImage: "test1.url",
            type: "2",
            price: "111111111.000",
            listThumbnailImage: "test1.uri",
            brandName: "현대",
          },
        ],
      });
  });
  test("SUCCESS : Get Full Products List!", async () => {
    await request(app)
      .get("/products")
      .query({})
      .expect(200)
      .expect({
        data: [
          {
            carId: 16,
            carName: "Q6",
            mainThumbnailImage: "test15.url",
            type: "2",
            price: "16161616.000",
            listThumbnailImage: "test96.uri",
            brandName: "아우디",
          },
          {
            carId: 15,
            carName: "Q8",
            mainThumbnailImage: "test14.url",
            type: "2",
            price: "15151515.000",
            listThumbnailImage: "test95.uri",
            brandName: "아우디",
          },
          {
            carId: 14,
            carName: "A8",
            mainThumbnailImage: "test13.url",
            type: "1",
            price: "14141414.000",
            listThumbnailImage: "test95.uri",
            brandName: "아우디",
          },
          {
            carId: 13,
            carName: "A3",
            mainThumbnailImage: "test12.url",
            type: "1",
            price: "13131313.000",
            listThumbnailImage: "test94.uri",
            brandName: "아우디",
          },
          {
            carId: 12,
            carName: "GLE",
            mainThumbnailImage: "test11.url",
            type: "2",
            price: "12121212.000",
            listThumbnailImage: "test93.uri",
            brandName: "벤츠",
          },
          {
            carId: 11,
            carName: "GLC",
            mainThumbnailImage: "test10.url",
            type: "2",
            price: "11101011.000",
            listThumbnailImage: "test92.uri",
            brandName: "벤츠",
          },
        ],
      });
  });
  test("SUCCESS : Sort Products In a Cheap Order!", async () => {
    await request(app)
      .get("/products")
      .query({ sort: "cheap" })
      .expect(200)
      .expect({
        data: [
          {
            carId: 5,
            carName: "3시리즈",
            mainThumbnailImage: "test4.url",
            type: "1",
            price: "555555.000",
            listThumbnailImage: "test5.uri",
            brandName: "BMW",
          },
          {
            carId: 3,
            carName: "카니발",
            mainThumbnailImage: "test3.url",
            type: "2",
            price: "3333333.000",
            listThumbnailImage: "test3.uri",
            brandName: "기아",
          },
          {
            carId: 4,
            carName: "K8",
            mainThumbnailImage: "test4.url",
            type: "1",
            price: "4444444.000",
            listThumbnailImage: "test4.uri",
            brandName: "기아",
          },
          {
            carId: 6,
            carName: "5시리즈",
            mainThumbnailImage: "test5.url",
            type: "1",
            price: "6666666.000",
            listThumbnailImage: "test6.uri",
            brandName: "BMW",
          },
          {
            carId: 10,
            carName: "C클래스",
            mainThumbnailImage: "test9.url",
            type: "1",
            price: "10101010.000",
            listThumbnailImage: "test91.uri",
            brandName: "벤츠",
          },
          {
            carId: 11,
            carName: "GLC",
            mainThumbnailImage: "test10.url",
            type: "2",
            price: "11101011.000",
            listThumbnailImage: "test92.uri",
            brandName: "벤츠",
          },
        ],
      });
  });
  test("SUCCESS : Invoke The List Of Products As Many As You Want!", async () => {
    await request(app)
      .get("/products")
      .query({ offset: 0, limit: 2 })
      .expect(200)
      .expect({
        data: [
          {
            carId: 16,
            carName: "Q6",
            mainThumbnailImage: "test15.url",
            type: "2",
            price: "16161616.000",
            listThumbnailImage: "test96.uri",
            brandName: "아우디",
          },
          {
            carId: 15,
            carName: "Q8",
            mainThumbnailImage: "test14.url",
            type: "2",
            price: "15151515.000",
            listThumbnailImage: "test95.uri",
            brandName: "아우디",
          },
        ],
      });
  });
  test("SUCCESS : Product Inquiry After Mileage Setting!", async () => {
    await request(app)
      .get("/products")
      .query({ minMileage: 1, maxMileage: 200000 })
      .expect(200)
      .expect({
        data: [
          {
            carId: 1,
            carName: "코나",
            mainThumbnailImage: "test1.url",
            type: "2",
            price: "111111111.000",
            listThumbnailImage: "test1.uri",
            brandName: "현대",
          },
        ],
      });
  });
  test("SUCCESS : Product Inquiry After Price Setting!", async () => {
    await request(app)
      .get("/products")
      .query({ minPrice: 1, maxPrice: 1000000 })
      .expect(200)
      .expect({
        data: [
          {
            carId: 5,
            carName: "3시리즈",
            mainThumbnailImage: "test4.url",
            type: "1",
            price: "555555.000",
            listThumbnailImage: "test5.uri",
            brandName: "BMW",
          },
        ],
      });
  });

  test("SUCCESS : No Items Detected!", async () => {
    await request(app)
      .get("/products")
      .query({ brand: 1, minYear: 1000, maxYear: 1001 })
      .expect(200)
      .expect({
        message: "NO ITEMS DETECTED!",
      });
  });
});

//   // 다음과 같이 본인이 작성한 코드에 맞춰 다양한 케이스를 모두 테스트해야 합니다.
//   // 그래야 의도에 맞게 코드가 잘 작성되었는지 테스트 단계에서부터 확인할 수 있습니다!
//   test("SUCCESS: created user", async () => {
//     await request(app)
//       .post("/users/signup")
//       .send({ email: "wecode001@gmail.com", password: "password001@" })
//       .expect(201);
//   });

//   test("FAILED: duplicated email", async () => {
//     await request(app)
//       .post("/users/signup")
//       .send({ email: "wecode001@gmail.com", password: "password001@" })
//       .expect(409)
//       .expect({ message: "duplicated email" });
//   });
// });
