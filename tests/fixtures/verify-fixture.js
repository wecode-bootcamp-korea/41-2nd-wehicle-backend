const { appDataSource } = require("../../src/models/appDataSource");

const createVerify = async (userId, verifyPhoneNumber, verifyCode) => {
  await appDataSource.query(
    `INSERT INTO verification_codes(
      user_id,
      phone_number,
      verify_code,
      active,
      verified)
    VALUES 
      (?,?,?,1,1)`,
    [userId, verifyPhoneNumber, verifyCode]
  );
};

module.exports = { createVerify };
