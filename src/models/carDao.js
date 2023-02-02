const { appDataSource } = require("./appDataSource");
const { forClause } = require("../utils/queryModules");

const getCarList = async (offset, limit, brand, type) => {
  const andClause = await forClause([brand, type], ["c.brand_id", "c.type"]);

  return appDataSource.query(
    `SELECT
    c.id,
    c.brand_id,
    c.name,
    c.thumbnail,
    c.size,
    c.type,
    b.name AS brandName
    FROM 
    cars c
    JOIN brands b ON c.brand_id = b.id
    WHERE TRUE
    ${andClause}
    LIMIT ${limit} OFFSET ${offset}`
  );
};

module.exports = { getCarList };
