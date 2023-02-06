const orderService = require("../services/orderService");
const { asyncErrorHandler } = require("../utils/error");

const getOrderUser = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const result = await orderService.getOrderUser(userId);
  return res.status(200).json({ data: result });
});

const postOrder = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const {
    biddingId,
    methodId,
    couponId,
    phoneNumber,
    address,
    deliveryDate,
    dealPrice,
    productId,
  } = req.body;
  await orderService.postOrder(
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
  return res.status(201).json({ message: "SUCCESS_ORDER" });
});

const postCoupon = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const { couponNumber } = req.body;
  await orderService.postCoupon(userId, couponNumber);
  return res.status(201).json({ message: "SUCCESS_POST_COUPON" });
});
module.exports = { postOrder, getOrderUser, postCoupon };
