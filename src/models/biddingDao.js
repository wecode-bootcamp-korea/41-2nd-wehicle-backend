const { appDataSource } = require("./appDataSource");

const getBiddingHistory = async (userId) => {
  return appDataSource.query(
    `SELECT
    p.id            AS productId,
    b.id            AS biddingId, 
    br.name         AS brandName,
    c.name          AS carName,
    p.thumbnail,
    p.price         AS sellPrice,
    b.price         AS bidPrice
    FROM 
      biddings b
    JOIN products p ON p.id = b.product_id
    JOIN cars c ON c.id = p.car_id
    JOIN brands br ON br.id = c.brand_id
    WHERE b.user_id = ? 
    AND p.id NOT IN (
      SELECT 
        product_id 
      FROM 
        orders)
    AND b.id NOT IN (
      SELECT 
        bidding_id 
      FROM 
        orders);
  `,
    [userId]
  );
};

const getFailedBidHistory = async (userId) => {
  return appDataSource.query(
    `SELECT
    p.id            AS productId,
    b.id            AS biddingId, 
    br.name         AS brandName,
    c.name          AS carName,
    p.thumbnail,
    p.price         AS sellPrice,
    b.price         AS bidPrice
    FROM 
      biddings b
    JOIN products p ON p.id = b.product_id
    JOIN cars c ON c.id = p.car_id
    JOIN brands br ON br.id = c.brand_id
    WHERE b.user_id = ?
    AND p.id IN 
      (SELECT 
        product_id 
      FROM 
        orders)
    AND b.id NOT IN (
      SELECT 
        bidding_id 
      FROM 
        orders);
  `,
    [userId]
  );
};

const getpurchasedHistory = async (userId) => {
  return appDataSource.query(
    `SELECT
      p.id            AS productId,
      o.id            AS orderId, 
      br.name         AS brandName,
      c.name          AS carName,
      p.thumbnail,
      o.deal_price    AS finalPrice
    FROM 
      orders o
    LEFT JOIN payments pm ON pm.order_id = o.id 
    JOIN products p ON p.id = o.product_id
    JOIN cars c ON c.id = p.car_id
    JOIN brands br ON br.id = c.brand_id
    WHERE 
      o.user_id = ?`,
    [userId]
  );
};

const getOnsaleHistory = async (userId) => {
  return appDataSource.query(
    `SELECT DISTINCT
      p.id            AS productId,
      br.name         AS brandName,
      c.name          AS carName,
      p.thumbnail,
      p.price         AS sellingPrice
    FROM 
      products p
    JOIN cars c ON c.id = p.car_id
    JOIN brands br ON br.id = c.brand_id
    JOIN biddings bd ON bd.product_id = p.id
    LEFT JOIN orders o ON o.bidding_id = bd.id
    WHERE p.user_id = ? 
    AND p.id NOT IN 
      (SELECT 
        product_id 
      FROM 
        orders);
    `,
    [userId]
  );
};

const getSoldOutHistory = async (userId) => {
  return appDataSource.query(
    `SELECT DISTINCT
      p.id            AS productId,
      br.name         AS brandName,
      c.name          AS carName,
      p.thumbnail,
      o.deal_price    AS finalPrice
    FROM 
      products p
    JOIN cars c ON c.id = p.car_id
    JOIN brands br ON br.id = c.brand_id
    JOIN biddings bd ON bd.product_id = p.id
    LEFT JOIN orders o ON o.bidding_id = bd.id
    WHERE 
      o.order_status_id IS NOT NULL
    AND p.user_id = ?`,
    [userId]
  );
};

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
  getBiddingHistory,
  getFailedBidHistory,
  getpurchasedHistory,
  getOnsaleHistory,
  getSoldOutHistory,
  createBid,
  createSell,
  updateBid,
  updateSell,
  deleteBid,
  deleteSell,
};
