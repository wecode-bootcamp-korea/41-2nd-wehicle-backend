const { appDataSource } = require("./appDataSource");

const sendVerifyCode = async (phoneNumber, verifyCode, userId) => {
  return appDataSource.query(
    `INSERT INTO verification_codes(
      user_id,
      phone_number,
      verify_code,
      active,
      verified
    )VALUES (
      ?,?,?,1,1
    )`,
    [userId, phoneNumber, verifyCode]
  );
};

const verificationCode = async (code) => {
  const result = await appDataSource.query(
    `SELECT
    phone_number,
    verify_code
    FROM verification_codes
    WHERE verify_code = ?`,
    [code]
  );

  await appDataSource.query(
    `UPDATE
    verification_codes
    SET active = 2, verified = 2
    WHERE verify_code = ?`,
    [code]
  );

  return result;
};

module.exports = { sendVerifyCode, verificationCode };
