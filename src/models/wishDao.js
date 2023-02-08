const { appDataSource } = require("./appDataSource");

const getWishList = async (userId) => {
  return appDataSource.query(
    `SELECT
    user_id,
    product_id
    FROM
    wishlists
    WHERE user_id = ?
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
