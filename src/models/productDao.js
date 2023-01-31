const { appDataSource } = require("./appDataSource");
const {
  whereClause,
<<<<<<< HEAD
  andClause,
  betweenClause,
=======
  betweenClause,
  forClause,
>>>>>>> 2bdd3ed ([ADD] 전체상품조회,옵션필터링,주행거리필터링,연식필터링,페이지네이션,정렬기능 추가)
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
<<<<<<< HEAD
  const whereBrand = whereClause(brand, "c.brand_id");
<<<<<<< HEAD
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
=======
=======
>>>>>>> f3307ab ([FIX] 변수명 변경, 낙찰받은 product 리스트조회 제외)
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
<<<<<<< HEAD
>>>>>>> 2bdd3ed ([ADD] 전체상품조회,옵션필터링,주행거리필터링,연식필터링,페이지네이션,정렬기능 추가)
  const andMileage = betweenClause(minMileage, maxMileage, "p.mileage");
  const andPrice = betweenClause(minPrice, maxPrice, "p.price");
  const andYear = betweenClause(minYear, maxYear, "p.year");
=======
  const andBetweenMileage = betweenClause(minMileage, maxMileage, "p.mileage");
  const andBetweenPrice = betweenClause(minPrice, maxPrice, "p.price");
  const andBetweenYear = betweenClause(minYear, maxYear, "p.year");
>>>>>>> f3307ab ([FIX] 변수명 변경, 낙찰받은 product 리스트조회 제외)

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
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
      ${andYear}
>>>>>>> 2bdd3ed ([ADD] 전체상품조회,옵션필터링,주행거리필터링,연식필터링,페이지네이션,정렬기능 추가)
      ${andMileage}
      ${andPrice}
=======
      ${andBetweenYear}
      ${andBetweenMileage}
      ${andBetweenPrice}
>>>>>>> f3307ab ([FIX] 변수명 변경, 낙찰받은 product 리스트조회 제외)
      ORDER BY ${sortMethod[sort]}
      LIMIT ${limit} OFFSET ${offset} 
      `
  );
};

module.exports = { getProductList };
