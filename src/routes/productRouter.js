const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

router.get("/:productId", productController.getProductDetail);
router.get("", productController.getProductList);
router.get("/search", productController.getSearchProducts);

module.exports = { router };
