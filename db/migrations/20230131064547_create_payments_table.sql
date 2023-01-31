-- migrate:up
CREATE TABLE payments (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  order_id INT NOT NULL,
  method_id INT NOT NULL,
  coupon_id INT NULL,
  total_price DECIMAL(12, 3) NOT NULL, 
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (order_id) REFERENCES orders (id),
  FOREIGN KEY (method_id) REFERENCES payment_methods (id),
  FOREIGN KEY (coupon_id) REFERENCES coupons (id)
);

-- migrate:down
DROP TABLE payments
