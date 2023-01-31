const productService = require("../services/productService");
const { asyncErrorHandler } = require("../utils/error");

const getProductList = asyncErrorHandler(async (req, res) => {
  const {
    oil,
    minYear,
    maxYear,
    sunroof,
    color,
    parkingSensor,
    backCamera,
    navi,
    heatingSeat,
    coolingSeat,
    smartKey,
    leatherSeat,
    size,
    type,
    brand,
    minMileage,
    maxMileage,
    minPrice,
    maxPrice,
    offset,
    limit,
    sort,
  } = req.query;
  const result = await productService.getProductList(
    oil,
    minYear,
    maxYear,
    sunroof,
    color,
    parkingSensor,
    backCamera,
    navi,
    heatingSeat,
    coolingSeat,
    smartKey,
    leatherSeat,
    size,
    type,
    brand,
    minMileage,
    maxMileage,
    minPrice,
    maxPrice,
    offset,
    limit,
    sort
  );
  return res.status(200).json({ data: result });
});

module.exports = { getProductList };
