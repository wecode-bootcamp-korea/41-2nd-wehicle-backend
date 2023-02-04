const biddingDao = require("../models/biddingDao");
const userDao = require("../models/userDao");

const createBid = async (userId, productId, price) => {
  return await biddingDao.createBid(userId, productId, price);
};

const createSell = async (
  userId,
  price,
  carId,
  oil,
  year,
  mileage,
  inspectionDate,
  color,
  sunroof,
  parkingsensor,
  backcamera,
  navi,
  heatingseat,
  coolingseat,
  smartkey,
  leatherseat,
  address,
  phoneNumber,
  images
) => {
  await biddingDao.createSell(
    userId,
    price,
    carId,
    oil,
    year,
    mileage,
    inspectionDate,
    color,
    sunroof,
    parkingsensor,
    backcamera,
    navi,
    heatingseat,
    coolingseat,
    smartkey,
    leatherseat,
    images
  );
  return await userDao.updateUserInfo(userId, address, phoneNumber);
};

const updateBid = async (userId, productId, price) => {
  return await biddingDao.updateBid(userId, productId, price);
};

const updateSell = async (userId, productId, price) => {
  return await biddingDao.updateSell(userId, productId, price);
};

const deleteBid = async (userId, productId) => {
  return await biddingDao.deleteBid(userId, productId);
};

const deleteSell = async (userId, productId) => {
  return await biddingDao.deleteSell(userId, productId);
};

module.exports = {
  createBid,
  createSell,
  updateBid,
  updateSell,
  deleteBid,
  deleteSell,
};
