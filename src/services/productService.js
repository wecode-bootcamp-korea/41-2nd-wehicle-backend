const productDao = require("../models/productDao");

const getProductList = async (params) => {
  const { offset = 0, limit = 8, sort = "lastest", ...filterOptions } = params;
  return await productDao.getProductList(offset, limit, sort, filterOptions);
};

module.exports = { getProductList };
