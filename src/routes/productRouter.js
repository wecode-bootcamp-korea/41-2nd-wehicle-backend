const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

router.get("", productController.getProductList);
router.get("/search", productController.getSearchProducts);

module.exports = { router };
