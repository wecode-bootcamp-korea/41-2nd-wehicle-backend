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

const getUserData = async (userId) => {
  const [userData] = await appDataSource.query(
    `SELECT
      nickname,
      points
    FROM 
      users
    WHERE
      id = ?`,
    [userId]
  );

  return userData;
};

const updateUserInfo = async (userId, address, phoneNumber) => {
  return appDataSource.query(
    `UPDATE
      users
    SET 
      address = ?, phone_number = ?
    WHERE
      id = ?`,
    [address, phoneNumber, userId]
  );
};

module.exports = {
  getUserInfo,
  createUser,
  getUserData,
  updateUserInfo,
};
