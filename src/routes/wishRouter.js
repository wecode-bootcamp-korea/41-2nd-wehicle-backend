const express = require("express");
const router = express.Router();
const { validateToken } = require("../utils/auth");

const wishController = require("../controllers/wishController");

router.get("", validateToken, wishController.getWishList);
router.post("", validateToken, wishController.postWishList);
router.delete("", validateToken, wishController.deleteWishList);

module.exports = { router };
