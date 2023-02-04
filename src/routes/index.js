const express = require("express");
const router = express.Router();

const userRouter = require("./userRouter");
const productRouter = require("./productRouter");
const carRouter = require("./carRouter");
const biddingRouter = require("./biddingRouter");

router.use("/users", userRouter.router);
router.use("/products", productRouter.router);
router.use("/cars", carRouter.router);
router.use("/bidding", biddingRouter.router);

module.exports = router;
