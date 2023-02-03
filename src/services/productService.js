const productDao = require("../models/productDao");
const { throwCustomError } = require("../utils/error");

const getProductList = async (params) => {
  const { offset = 0, limit = 8, sort = "lastest", ...filterOptions } = params;
  return await productDao.getProductList(offset, limit, sort, filterOptions);
};
const getSearchProducts = async (query) => {
  const { offset = 0, limit = 8, keyword } = query;
  return productDao.getSearchProducts(keyword, offset, limit);
};

const getProductDetail = async (productId, query) => {
  const { period, year } = query;

  const productDetail = await productDao.getProductDetail(productId);

  const carId = productDetail.carId;

  const productMarketPrice = await productDao.getProductMarketPrice(
    carId,
    period,
    year
  );

  return { productDetail, productMarketPrice };
};

module.exports = { getProductList, getSearchProducts, getProductDetail };
