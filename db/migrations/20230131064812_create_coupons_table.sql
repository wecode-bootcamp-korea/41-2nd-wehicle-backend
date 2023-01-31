-- migrate:up
CREATE TABLE coupons (
  id INT NOT NULL AUTO_INCREMENT,
  code VARCHAR(36) NOT NULL DEFAULT (UUID()),
  active BOOLEAN NOT NULL,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(200) NULL,
  type_id INT NOT NULL,
  expired_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (type_id) REFERENCES coupon_types (id)
);

-- migrate:down
DROP TABLE coupons;
