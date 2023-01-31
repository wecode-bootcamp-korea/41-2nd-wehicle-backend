const { appDataSource } = require("./appDataSource");

const getUserInfo = async (socialId, socialTypeId) => {
  const [userInfo] = await appDataSource.query(
    `SELECT
      id
    FROM
      users
    WHERE
      social_id = ? AND social_type_id = ?`,
    [socialId, socialTypeId]
  );

  return userInfo;
};

const createUser = async (socialId, email, nickname, socialTypeId) => {
  return appDataSource.query(
    `INSERT INTO users (
      social_id,
      email,
      nickname,
      social_type_id
    ) 
    VALUES (
      ?, 
      ?, 
      ?, 
      ?
    )`,
    [socialId, email, nickname, socialTypeId]
  );
};

module.exports = {
  getUserInfo,
  createUser,
};
