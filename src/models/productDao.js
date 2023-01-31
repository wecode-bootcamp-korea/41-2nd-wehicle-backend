const { appDataSource } = require("./appDataSource");
const {
  whereClause,
  andClause,
  betweenClause,
} = require("../utils/queryModules");

const getProductList = async (
  oil,
  minYear,
  maxYear,
  sunroof,
  color,
  parkingSensor,
  backCamera,
  navi,
  heatingSeat,
  coolingSeat,
  smartKey,
  leatherSeat,
  size,
  type,
  brand,
  minMileage,
  maxMileage,
  minPrice,
  maxPrice,
  offset,
  limit,
  sort
) => {
  const sortMethod = Object.freeze({
    cheap: "p.price ASC",
    expensive: "p.price DESC",
    lastest: "p.created_at DESC",
    oldest: "p.created_at ASC",
  });
  const whereBrand = whereClause(brand, "c.brand_id");
  const andType = andClause(type, "c.type");
  const andSize = andClause(size, "c.size_id");
  const andOil = andClause(oil, "p.oil");
  const andSunroof = andClause(sunroof, "po.sunroof");
  const andColor = andClause(color, "po.color");
  const andParkingSensor = andClause(parkingSensor, "po.parkingsensor");
  const andBackCamera = andClause(backCamera, "po.backcamera");
  const andNavi = andClause(navi, "po.heatingseat");
  const andHeatingSeat = andClause(heatingSeat, "po.heatingseat");
  const andCoolingSeat = andClause(coolingSeat, "po.coolingseat");
  const andSmartKey = andClause(smartKey, "po.smartkey");
  const andLeatherSeat = andClause(leatherSeat, "po.leatherseat");
  const andMileage = betweenClause(minMileage, maxMileage, "p.mileage");
  const andPrice = betweenClause(minPrice, maxPrice, "p.price");
  const andYear = betweenClause(minYear, maxYear, "p.year");

  return await appDataSource.query(
    `SELECT
        c.id        AS carId,
        c.name      AS carName,
        c.thumbnail AS mainThumbnailImage,
        c.type      AS type,
        p.price     AS price,
        p.thumbnail AS listThumbnailImage,
        b.name      AS brandName
      FROM 
        cars c
      JOIN brands b           ON c.brand_id = b.id
      JOIN products p         ON p.car_id = c.id
      JOIN product_options po ON po.product_id = p.id
      ${whereBrand}
      ${andType}
      ${andSize}
      ${andOil}
      ${andYear}
      ${andSunroof}
      ${andColor}
      ${andParkingSensor}
      ${andBackCamera}
      ${andHeatingSeat}
      ${andNavi}
      ${andCoolingSeat}
      ${andSmartKey}
      ${andLeatherSeat}
      ${andMileage}
      ${andPrice}
      ORDER BY ${sortMethod[sort]}
      LIMIT ${limit} OFFSET ${offset} 
      `
  );
};

module.exports = { getProductList };
