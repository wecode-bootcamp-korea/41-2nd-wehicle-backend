const orderDao = require("../models/orderDao");
const { throwCustomError } = require("../utils/error");

const getOrderUser = async (userId) => {
  return orderDao.getOrderUser(userId);
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
  return orderDao.postOrder(
    biddingId,
    methodId,
    couponId,
    phoneNumber,
    address,
    userId,
    deliveryDate,
    dealPrice,
    productId
  );
};

const postCoupon = async (userId, couponNumber) => {
  if (!userId) throwCustomError("로그인후 다시시도해주세요", 400);
  if (!couponNumber) throwCustomError("쿠폰번호를 입력하시오", 400);
  return orderDao.postCoupon(userId, couponNumber);
};

module.exports = { postOrder, getOrderUser, postCoupon };
