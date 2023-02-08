const wishService = require("../services/wishService");
const { asyncErrorHandler } = require("../utils/error");

const getWishList = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const result = await wishService.getWishList(userId);
  return res.status(200).json({ data: result });
});

const postWishList = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const { productId } = req.body;
  await wishService.postWishList(userId, productId);
  return res.status(201).json({ message: "SUCCESS_POST_WISH_LIST" });
});

const deleteWishList = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const { productId } = req.body;
  await wishService.deleteWishList(userId, productId);
  return res.status(200).json({ message: "SUCCESS_DELETE_WISH_LIST" });
});

module.exports = { getWishList, postWishList, deleteWishList };
