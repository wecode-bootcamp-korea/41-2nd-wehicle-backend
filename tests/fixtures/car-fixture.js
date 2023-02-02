const { appDataSource } = require("../../src/models/appDataSource");

const createCars = async (carArr) => {
  const carValueSet = carArr.map((e) => {
    return [e.brand_id, e.name, e.thumbnail, e.size, e.type];
  });

  await appDataSource.query(
    `INSERT INTO cars(
      brand_id,
      name,
      thumbnail,
      size,
      type) 
    VALUES 
      ?`,
    [carValueSet]
  );
};

const createBrands = async (brandArr) => {
  const brandValueSet = brandArr.map((e) => {
    return [e.name];
  });

  await appDataSource.query(
    `INSERT INTO brands(
      name) 
    VALUES 
      ?`,
    [brandValueSet]
  );
};

module.exports = { createCars, createBrands };
