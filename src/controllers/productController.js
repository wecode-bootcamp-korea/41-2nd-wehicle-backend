const productService = require("../services/productService");
const { asyncErrorHandler } = require("../utils/error");

const getProductList = asyncErrorHandler(async (req, res) => {
  const result = await productService.getProductList(req.query);
  return res.status(200).json({ data: result });
});

module.exports = { getProductList };
