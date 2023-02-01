const { appDataSource } = require("../../src/models/appDataSource");

const createOrder = async (orderArr) => {
  const orderValueSet = orderArr.map((e) => {
    return [e.bidding_id, e.delivery_date, e.order_status_id, e.deal_price];
  });

  await appDataSource.query(
    `INSERT INTO orders(
      bidding_id,
      delivery_date,
      order_status_id,
      deal_price) 
    VALUES 
      ?`,
    [orderValueSet]
  );
};

module.exports = { createOrder };
