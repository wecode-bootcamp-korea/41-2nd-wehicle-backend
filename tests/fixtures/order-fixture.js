const { appDataSource } = require("../../src/models/appDataSource");

const createOrder = async (orderArr) => {
  const orderValueSet = orderArr.map((e) => {
    return [
      e.bidding_id,
      e.user_id,
      e.product_id,
      e.delivery_date,
      e.order_status_id,
      e.deal_price,
    ];
  });

  await appDataSource.query(
    `INSERT INTO orders(
      bidding_id,
      user_id,
      product_id,
      delivery_date,
      order_status_id,
      deal_price) 
    VALUES 
      ?`,
    [orderValueSet]
  );
};

const createPayment = async (paymentArr) => {
  const paymentValueSet = paymentArr.map((e) => {
    return [e.user_id, e.order_id, e.method_id, e.coupon_id, e.total_price];
  });

  await appDataSource.query(
    `INSERT INTO payments(
      user_id,
      order_id,
      method_id,
      coupon_id,
      total_price)
    VALUES 
      ?`,
    [paymentValueSet]
  );
};

module.exports = { createOrder, createPayment };
