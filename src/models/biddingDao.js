const { appDataSource } = require("./appDataSource");

const createBid = async (userId, productId, price) => {
  return appDataSource.query(
    `INSERT INTO biddings (
      user_id,
      product_id,
      price
    ) VALUES (
      ?,
      ?,
      ?
    )`,
    [userId, productId, price]
  );
};

const createSell = async (
  userId,
  price,
  carId,
  oil,
  year,
  mileage,
  inspectionDate,
  color,
  sunroof,
  parkingsensor,
  backcamera,
  navi,
  heatingseat,
  coolingseat,
  smartkey,
  leatherseat,
  images
) => {
  const queryRunner = appDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const createProduct = await queryRunner.query(
      `INSERT INTO products (
        user_id,
        car_id,
        thumbnail,
        oil,
        year,
        mileage,
        price,
        inspection_date
      ) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )`,
      [userId, carId, images[0], oil, year, mileage, price, inspectionDate]
    );

    const productId = createProduct.insertId;

    const insertImeagesQuery = `
    INSERT INTO product_images (
      product_id,
      image_url
    ) VALUES ?;`;

    let imageValueSet = [];
    for (let i = 1; i < images.length; i++) {
      imageValueSet.push([productId, images[i]]);
    }

    await queryRunner.query(insertImeagesQuery, [imageValueSet]);

    await queryRunner.query(
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
        leatherseat
      ) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )`,
      [
        productId,
        color,
        sunroof,
        parkingsensor,
        backcamera,
        navi,
        heatingseat,
        coolingseat,
        smartkey,
        leatherseat,
      ]
    );

    await queryRunner.commitTransaction();
  } catch (err) {
    console.log(err);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
};

const updateBid = async (userId, productId, price) => {
  return appDataSource.query(
    `UPDATE 
      biddings
    SET 
      price = ?
    WHERE
      user_id = ? AND product_id = ?
    `,
    [price, userId, productId]
  );
};

const updateSell = async (userId, productId, price) => {
  return appDataSource.query(
    `UPDATE
      products
    SET
      price = ?
    WHERE
      user_id = ? AND id = ?`,
    [price, userId, productId]
  );
};

const deleteBid = async (userId, productId) => {
  return appDataSource.query(
    `DELETE FROM
      biddings
    WHERE
      user_id = ? AND product_id = ?`,
    [userId, productId]
  );
};

const deleteSell = async (userId, productId) => {
  return appDataSource.query(
    `DELETE FROM
      products
    WHERE
      user_id = ? AND id = ?`,
    [userId, productId]
  );
};

module.exports = {
  createBid,
  createSell,
  updateBid,
  updateSell,
  deleteBid,
  deleteSell,
};
