const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

router.get("", productController.getProductList);
router.get("/:productId", productController.getProductDetail);

module.exports = { router };
