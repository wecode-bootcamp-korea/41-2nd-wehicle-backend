const { appDataSource } = require("../../src/models/appDataSource");

const createBidding = async (biddingArr) => {
  const biddingValueSet = biddingArr.map((e) => {
    return [e.user_id, e.product_id, e.price];
  });

  await appDataSource.query(
    `INSERT INTO biddings(
      user_id,
      product_id,
      price)
    VALUES 
      ?`,
    [biddingValueSet]
  );
};

module.exports = { createBidding };
