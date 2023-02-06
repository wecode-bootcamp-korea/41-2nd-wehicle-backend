const express = require("express");
const router = express.Router();
const { validateToken } = require("../utils/auth");

const orderController = require("../controllers/orderController");

router.get("", validateToken, orderController.getOrderUser);
router.post("", validateToken, orderController.postOrder);
router.post("/coupon", validateToken, orderController.postCoupon);

module.exports = { router };
