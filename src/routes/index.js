const express = require("express");
const router = express.Router();

const userRouter = require("./userRouter");
const productRouter = require("./productRouter");
const carRouter = require("./carRouter");
const biddingRouter = require("./biddingRouter");
const orderRouter = require("./orderRouter");
const verifyRouter = require("./verifyRouter");
const wishRouter = require("./wishRouter");

router.use("/users", userRouter.router);
router.use("/products", productRouter.router);
router.use("/cars", carRouter.router);
router.use("/bidding", biddingRouter.router);
router.use("/orders", orderRouter.router);
router.use("/verify", verifyRouter.router);
router.use("/wishlists", wishRouter.router);

module.exports = router;
