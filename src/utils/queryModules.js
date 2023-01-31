const forClause = (a, b) => {
  let aList = [];
  let bList = [];
  let result = "";
  let arr = [];

  for (i = 0; i < a.length; i++) {
    if (!a[i]) arr.push(a[i]);

    aList.push(a[i]);
  }
  for (j = 0; j < b.length; j++) {
    if (!b[j]) arr.push(b[j]);

    bList.push(b[j]);
  }
  for (k = 0; k < aList.length; k++) {
    result += andClause(aList[k], bList[k]);
  }
  return result;
};

const whereClause = (params, params2) => {
  return params ? `WHERE ${params2} = ${params} ` : "WHERE TRUE";
};

const andClause = (params, params2) => {
  return params ? `AND ${params2} = ${params} ` : "";
};

const betweenClause = (params, params2, params3) => {
  return params2 ? `AND ${params3} BETWEEN ${params} AND ${params2} ` : "";
};

module.exports = { whereClause, betweenClause, forClause };
