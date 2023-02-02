const { appDataSource } = require("./appDataSource");
const { betweenClause, forClause } = require("../utils/queryModules");

const getProductList = async (offset, limit, sort, filterOptions) => {
  const sortMethod = Object.freeze({
    cheap: "p.price ASC",
    expensive: "p.price DESC",
    lastest: "p.created_at DESC",
    oldest: "p.created_at ASC",
  });

  const andType = forClause(
    [
      filterOptions.brand,
      filterOptions.oil,
      filterOptions.sunroof,
      filterOptions.color,
      filterOptions.parkingsensor,
      filterOptions.backcamera,
      filterOptions.navi,
      filterOptions.heatingseat,
      filterOptions.coolingseat,
      filterOptions.smartkey,
      filterOptions.leatherseat,
      filterOptions.size,
      filterOptions.type,
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
  const andBetweenMileage = betweenClause(
    filterOptions.minMileage,
    filterOptions.maxMileage,
    "p.mileage"
  );
  const andBetweenPrice = betweenClause(
    filterOptions.minPrice,
    filterOptions.maxPrice,
    "p.price"
  );
  const andBetweenYear = betweenClause(
    filterOptions.minYear,
    filterOptions.maxYear,
    "p.year"
  );

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

const getSearchProducts = async (keyword, offset, limit) => {
  return await appDataSource.query(
    `SELECT
    p.car_id,
    p.thumbnail,
    p.price,
    p.id,
    c.name
    FROM
    products p
    JOIN cars c ON p.car_id = c.id
    WHERE c.name LIKE "%${keyword}%"
    LIMIT ${limit} OFFSET ${offset}`
  );
};

module.exports = { getProductList, getSearchProducts };
