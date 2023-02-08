const wishDao = require("../models/wishDao");

const getWishList = async (userId) => {
  return wishDao.getWishList(userId);
};

const postWishList = async (userId, productId) => {
  return wishDao.postWishList(userId, productId);
};

const deleteWishList = async (userId, productId) => {
  return wishDao.deleteWishList(userId, productId);
};

module.exports = { getWishList, postWishList, deleteWishList };
