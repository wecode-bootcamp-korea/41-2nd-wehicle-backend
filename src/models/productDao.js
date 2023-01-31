const { appDataSource } = require("./appDataSource");
const { betweenClause, forClause } = require("../utils/queryModules");

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
  const andType = forClause(
    [
      brand,
      oil,
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
    ],
    [
      "c.brand_id",
      "p.oil",
      "po.sunroof",
      "po.color",
      "po.parkingsensor",
      "po.backcamera",
      "po.navi",
      "po.heatingseat",
      "po.coolingseat",
      "po.smartkey",
      "po.leatherseat",
      "c.size",
      "c.type",
    ]
  );
  const andBetweenMileage = betweenClause(minMileage, maxMileage, "p.mileage");
  const andBetweenPrice = betweenClause(minPrice, maxPrice, "p.price");
  const andBetweenYear = betweenClause(minYear, maxYear, "p.year");

  return await appDataSource.query(
    `SELECT
        c.id        AS carId,
        c.name      AS carName,
        c.thumbnail AS mainThumbnailImage,
        c.type      AS type,
        p.id        AS productId,
        p.price     AS price,
        p.thumbnail AS listThumbnailImage,
        b.name      AS brandName
      FROM 
        cars c
      JOIN brands b           ON c.brand_id = b.id
      JOIN products p         ON p.car_id = c.id
      JOIN product_options po ON po.product_id = p.id
      LEFT JOIN biddings bd        ON bd.product_id = p.id
      LEFT JOIN orders o           ON o.bidding_id = bd.id
      WHERE o.order_status_id IS NULL
      ${andType}
      ${andBetweenYear}
      ${andBetweenMileage}
      ${andBetweenPrice}
      ORDER BY ${sortMethod[sort]}
      LIMIT ${limit} OFFSET ${offset} 
      `
  );
};

module.exports = { getProductList };
