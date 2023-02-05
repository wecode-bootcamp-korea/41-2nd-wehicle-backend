const biddingService = require("../services/biddingService");
const { asyncErrorHandler, throwCustomError } = require("../utils/error");

const getBidHistory = asyncErrorHandler(async (req, res) => {
  const bidHistory = await biddingService.getBidHistory(req.userId);
  return res.status(200).json({ bidHistory });
});

const getSellHistory = asyncErrorHandler(async (req, res) => {
  const sellHistory = await biddingService.getSellHistory(req.userId);
  return res.status(200).json({ sellHistory });
});

const createBid = asyncErrorHandler(async (req, res) => {
  const { productId, price } = req.body;

  if (!productId || !price) throwCustomError("MISSING_BID_INFO", 400);

  await biddingService.createBid(req.userId, productId, price);
  return res.status(201).json({ message: "BidPriceCreated!" });
});

const createSell = asyncErrorHandler(async (req, res) => {
  const images = req.files.map(({ location }) => location);

  const {
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
  } = req.body;

  if (!price) throwCustomError("MISSING_SELL_PRICE", 400);

  if (!carId || !oil || !year || !mileage || !inspectionDate)
    throwCustomError("INSUFFICIENT_SELLING_PRODUCT_DETAIL_INFO", 400);

  if (
    !color ||
    !sunroof ||
    !parkingsensor ||
    !backcamera ||
    !navi ||
    !heatingseat ||
    !coolingseat ||
    !smartkey ||
    !leatherseat
  )
    throwCustomError("INSUFFICIENT_SELLING_PRODUCT_OPTIONS_INFO", 400);

  if (images.length === 0)
    throwCustomError("MISSING_SELLING_PRODUCT_IMAGES", 400);

  if (!address || !phoneNumber) throwCustomError("MISSING_USER_INFO", 400);

  await biddingService.createSell(
    req.userId,
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
  );

  return res.status(201).json({ message: "SellPriceCreated!" });
});

const updateBid = asyncErrorHandler(async (req, res) => {
  const { productId, price } = req.body;

  if (!productId || !price) throwCustomError("MISSING_UPDATED_BID_INFO", 400);

  await biddingService.updateBid(req.userId, productId, price);
  return res.status(201).json({ message: "BidPriceUpdated!" });
});

const updateSell = asyncErrorHandler(async (req, res) => {
  const { productId, price } = req.body;

  if (!productId || !price) throwCustomError("MISSING_UPDATED_SELL_INFO", 400);

  await biddingService.updateSell(req.userId, productId, price);
  return res.status(201).json({ message: "SellPriceUpdated!" });
});

const deleteBid = asyncErrorHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) throwCustomError("MISSING_BID_INFO", 400);

  await biddingService.deleteBid(req.userId, productId);
  return res.status(200).json({ message: "BidDeleted!" });
});

const deleteSell = asyncErrorHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) throwCustomError("MISSING_SELL_INFO", 400);

  await biddingService.deleteBid(req.userId, productId);
  return res.status(200).json({ message: "SellingProductDeleted!" });
});

module.exports = {
  getBidHistory,
  getSellHistory,
  createBid,
  createSell,
  updateBid,
  updateSell,
  deleteBid,
  deleteSell,
};
