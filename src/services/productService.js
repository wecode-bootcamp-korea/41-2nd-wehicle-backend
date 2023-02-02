const productDao = require("../models/productDao");

const getProductList = async (params) => {
  const { offset = 0, limit = 8, sort = "lastest", ...filterOptions } = params;
  return await productDao.getProductList(offset, limit, sort, filterOptions);
};
const getSearchProducts = async (query) => {
  const { offset = 0, limit = 8, keyword } = query;
  return productDao.getSearchProducts(keyword, offset, limit);
};

module.exports = { getProductList, getSearchProducts };
