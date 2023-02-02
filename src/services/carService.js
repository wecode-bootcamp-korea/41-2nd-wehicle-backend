const carDao = require("../models/carDao");

const getCarList = async (params) => {
  const { offset = 0, limit = 6, brand, type } = params;
  return await carDao.getCarList(offset, limit, brand, type);
};

module.exports = { getCarList };
