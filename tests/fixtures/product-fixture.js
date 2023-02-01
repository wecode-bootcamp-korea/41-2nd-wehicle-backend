const { appDataSource } = require("../../src/models/appDataSource");

const createProduct = async (productArr) => {
  const productValueSet = productArr.map(function (e) {
    return [
      e.user_id,
      e.car_id,
      e.thumbnail,
      e.oil,
      e.year,
      e.mileage,
      e.price,
      e.inspection_date,
    ];
  });

  await appDataSource.query(
    `INSERT INTO products (
      user_id,
      car_id,
      thumbnail,
      oil,
      year,
      mileage,
      price,
      inspection_date) 
    VALUES 
      ?`,
    [productValueSet]
  );
};

const createProductOption = async (optionArr) => {
  const optionValueSet = optionArr.map(function (e) {
    return [
      e.product_id,
      e.color,
      e.sunroof,
      e.parkingsensor,
      e.backcamera,
      e.navi,
      e.heatingseat,
      e.coolingseat,
      e.smartkey,
      e.leatherseat,
    ];
  });

  await appDataSource.query(
    `INSERT INTO product_options (
      product_id,
      color,
      sunroof,
      parkingsensor,
      backcamera,
      navi,
      heatingseat,
      coolingseat,
      smartkey,
      leatherseat)
    VALUES 
      ?`,
    [optionValueSet]
  );
};

const createProductImage = async (imageArr) => {
  const imageValueSet = imageArr.map((e) => {
    return [e.image_url, e.product_id];
  });

  await appDataSource.query(
    `INSERT INTO product_images (
      image_url,
      product_id)
    VALUES 
      ?`,
    [imageValueSet]
  );
};

module.exports = {
  createProduct,
  createProductOption,
  createProductImage,
};
