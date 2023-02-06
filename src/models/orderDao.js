const { appDataSource } = require("./appDataSource");
const queryRunner = appDataSource.createQueryRunner();

const getOrderUser = async (userId) => {
  return appDataSource.query(
    `SELECT 
    u.nickname,
u.points,
cu.coupon_id,
c.active,
c.name,
c.description,
ct.type
FROM users u 
LEFT JOIN coupon_user cu ON u.id = cu.user_id
LEFT JOIN coupons c ON cu.coupon_id = c.id
LEFT JOIN coupon_types ct ON c.type_id   = ct.id
WHERE u.id = ?`,
    [userId]
  );
};

const postOrder = async (
  biddingId,
  methodId,
  couponId,
  phoneNumber,
  address,
  userId,
  deliveryDate,
  dealPrice,
  productId
) => {
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    await queryRunner.query(
      `UPDATE 
  users
  SET 
  address= ?, 
  phone_number = ?
  WHERE id = ?`,
      [address, phoneNumber, userId]
    );
    const createOrder = await queryRunner.query(
      `INSERT INTO 
        orders(
          user_id,
          product_id,
          bidding_id,
          deal_price,
          delivery_date,
          order_status_id
          )VALUES
          (?,?,?,?,?,2)`,
      [userId, productId, biddingId, dealPrice, deliveryDate]
    );

    const orderId = createOrder.insertId;

    await queryRunner.query(
      `INSERT INTO
      payments(
        user_id,
        order_id,
        method_id,
        coupon_id,
        total_price
      ) VALUES(
        ?,?,?,?,?
      )`,
      [userId, orderId, methodId, couponId, dealPrice]
    );

    if (methodId === 5) {
      await queryRunner.query(
        `UPDATE 
      users
      SET 
      points = points - ${dealPrice}
      WHERE id = ${userId} `
      );
    }

    couponId
      ? await queryRunner.query(
          `DELETE FROM coupon_user
    WHERE user_id = ${userId} AND coupon_id = ${couponId}`
        )
      : "";
    await queryRunner.commitTransaction();
  } catch {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

const postCoupon = async (userId, couponNumber) => {
  const result = await queryRunner.query(
    `SELECT
    c.id 
    c.code,
    c.active,
    c.name,
    type_id
    FROM
    coupons c
    WHERE c.code = ?`,
    [couponNumber]
  );

  return await queryRunner.query(
    `INSERT INTO coupon_user(coupon_id, user_Id)
    VALUES (?, ?)`,
    [result.id, userId]
  );
};

module.exports = { getOrderUser, postOrder, postCoupon };
