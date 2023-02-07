const productService = require("../services/productService");
const { asyncErrorHandler, throwCustomError } = require("../utils/error");

const getProductList = asyncErrorHandler(async (req, res) => {
  const result = await productService.getProductList(req.query);
  return res.status(200).json({ data: result });
});

const getProductDetail = asyncErrorHandler(async (req, res) => {
  const { productId } = req.params;
  const queryParams = req.query;

  const productDetail = await productService.getProductDetail(
    productId,
    queryParams
  );
  return res.status(200).json({ data: productDetail });
});

module.exports = { getProductList, getProductDetail };
