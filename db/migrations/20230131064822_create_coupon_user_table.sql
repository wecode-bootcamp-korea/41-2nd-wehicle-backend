-- migrate:up
CREATE TABLE coupon_user (
  id INT NOT NULL AUTO_INCREMENT,
  coupon_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (coupon_id) REFERENCES coupons (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- migrate:down
DROP TABLE coupon_user;
