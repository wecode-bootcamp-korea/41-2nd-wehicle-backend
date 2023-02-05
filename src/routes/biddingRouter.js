const express = require("express");
const router = express.Router();

const biddingController = require("../controllers/biddingController");
const uploadImages = require("../utils/multer");
const { validateToken } = require("../utils/auth");

router.get("/bid", validateToken, biddingController.getBidHistory);
router.get("/sell", validateToken, biddingController.getSellHistory);
router.post("/bid", validateToken, biddingController.createBid);
router.post("/sell", validateToken, uploadImages, biddingController.createSell);
router.patch("/bid", validateToken, biddingController.updateBid);
router.patch("/sell", validateToken, biddingController.updateSell);
router.delete("/bid", validateToken, biddingController.deleteBid);
router.delete("/sell", validateToken, biddingController.deleteSell);

module.exports = { router };
