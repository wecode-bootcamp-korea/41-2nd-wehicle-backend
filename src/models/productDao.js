const { appDataSource } = require("./appDataSource");
const { betweenClause, forClause } = require("../utils/queryModules");

const getProductList = async (offset, limit, sort, keyword, filterOptions) => {
  const searchClause = keyword ? `AND c.name LIKE "%${keyword}%"` : "";
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
      ${searchClause}
      ORDER BY ${sortMethod[sort]}
      LIMIT ${limit} OFFSET ${offset} 
      `
  );
};

const getProductDetail = async (productId) => {
  const [productDetail] = await appDataSource.query(
    `SELECT
      p.id,
      b.name                                  AS brandName,
      c.id                                    AS carId,
      p.price                                 AS sellingPrice,
      c.name                                  AS carName,
      p.year                                  AS year,
      p.mileage                               AS mileage,
      p.thumbnail                             AS thumbnail,
      JSON_ARRAYAGG(
        pi.image_url
      ) AS images,
      options.options,
      top3.biddingPrice
    FROM products p
    JOIN cars c ON p.car_id = c.id
    JOIN brands b ON c.brand_id = b.id
    JOIN product_options po ON p.id = po.product_id
    JOIN product_images pi ON p.id = pi.product_id

    RIGHT JOIN (
      SELECT
        p.id,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'sunroof', po.sunroof,
            'backcamera', po.backcamera,
            'parkingsensor', po.parkingsensor,
            'heatingseat', po.heatingseat,
            'navi', po.navi,
            'smartkey', po.smartkey,
            'coolingseat', po.coolingseat,
            'leatherseat', po.leatherseat
          )
        )                                      AS options
      FROM product_options po
      INNER JOIN products p ON po.product_id = p.id
      WHERE p.id = ${productId}
      GROUP BY p.id
    ) AS options ON options.id = p.id
    
    RIGHT JOIN (
      SELECT
        A.id,
        JSON_ARRAYAGG(A.price)                 AS biddingPrice
        FROM (
          SELECT 
            p.id, 
            bd.price
          FROM 
            biddings bd
          INNER JOIN products p ON p.id = bd.product_id 
          WHERE p.id = ${productId}
          ORDER BY bd.price DESC LIMIT 3
        ) AS A 
        GROUP BY A.id
      ) AS top3 ON top3.id = p.id
    WHERE p.id = ${productId}
    GROUP BY p.id;`
  );

  return productDetail;
};

const getProductMarketPrice = async (carId, period, year) => {
  const andPeriod = period
    ? `AND o.created_at BETWEEN DATE_ADD(NOW(), INTERVAL -${period} MONTH) AND NOW()`
    : ``;
  const andYear = year ? `AND p.year = ${year}` : "";

  const productMarketPrice = await appDataSource.query(
    `SELECT
      c.id,
      JSON_ARRAYAGG(
        JSON_OBJECT(
        'x', DATE_FORMAT(o.created_at, '%Y/%m/%d'),
        'y', o.deal_price
        )
      ) AS data
    FROM orders o
    JOIN biddings b ON o.bidding_id = b.id
    JOIN products p on b.product_id = p.id
    JOIN cars c ON p.car_id = c.id
    WHERE c.id = ${carId}
    ${andPeriod}
    ${andYear}
    ORDER BY o.created_at;
    `
  );

  return productMarketPrice;
};

module.exports = {
  getProductList,
  getProductDetail,
  getProductMarketPrice,
};
