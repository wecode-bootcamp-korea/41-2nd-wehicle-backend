const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const allowedExtentions = [".png", ".jpg", ".jpeg", ".bmp"];

const uploadImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: "wehicle-s3-bucket",
    key: (req, file, callback) => {
      const uploadDirectory = req.query.directory ?? "";
      const extension = path.extname(file.originalname);
      if (!allowedExtentions.includes(extension.toLowerCase())) {
        return callback(new Error("wrong extension"));
      }
      callback(null, `${uploadDirectory}/${Date.now()}_${file.originalname}`);
    },
    acl: "public-read-write",
  }),
}).array("images", 5);

module.exports = uploadImages;
