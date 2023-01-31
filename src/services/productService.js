const productDao = require("../models/productDao");
const { throwCustomError } = require("../utils/error");

const getProductList = async (
  oil,
  minYear = 0,
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
  minMileage = 0,
  maxMileage,
  minPrice = 0,
  maxPrice,
  offset = 0,
  limit = 6,
  sort = "expensive"
) => {
  const result = await productDao.getProductList(
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
  if (!result.length) throwCustomError("NO ITEMS DETECTED!", 200);

  return result;
};

module.exports = { getProductList };
