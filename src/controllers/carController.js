const carService = require("../services/carService");
const { asyncErrorHandler } = require("../utils/error");

const getCarList = asyncErrorHandler(async (req, res) => {
  const result = await carService.getCarList(req.query);
  return res.status(200).json({ data: result });
});

module.exports = { getCarList };
