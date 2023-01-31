const whereClause = (params, params2) => {
  return params ? `WHERE ${params2} = ${params}` : "WHERE TRUE";
};

const andClause = (params, params2) => {
  return params ? `AND ${params2} = ${params}` : "";
};

const betweenClause = (params, params2, params3) => {
  return params2 ? `AND ${params3} BETWEEN ${params} AND ${params2}` : "";
};

module.exports = { whereClause, andClause, betweenClause };
