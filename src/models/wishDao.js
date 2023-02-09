const { appDataSource } = require("./appDataSource");

const getWishList = async (userId) => {
  return appDataSource.query(
    `SELECT
    p.id as productId,
    p.thumbnail,
    b.name as brandName,
    c.name as carName,
    p.price as price
    FROM
    wishlists w
    JOIN products p ON w.product_id = p.id
    JOIN cars c ON c.id = p.car_id
    JOIN brands b ON b.id = c.brand_id
    LEFT JOIN orders o ON o.product_id = p.id
    WHERE o.id IS NULL
    AND w.user_id = ?
    `,
    [userId]
  );
};

const postWishList = async (userId, productId) => {
  return appDataSource.query(
    `INSERT INTO wishlists(
      user_id,
      product_id
    )VALUES (
      ?, ?)`,
    [userId, productId]
  );
};

const deleteWishList = async (userId, productId) => {
  return appDataSource.query(
    `DELETE FROM wishlists WHERE
    user_id = ? AND product_id = ?`,
    [userId, productId]
  );
};

module.exports = { getWishList, postWishList, deleteWishList };
