-- migrate:up
CREATE TABLE orders (
  id INT NOT NULL AUTO_INCREMENT,
  bidding_id INT NOT NULL,
  delivery_date DATE NOT NULL,
  order_status_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (bidding_id) REFERENCES biddings (id),
  FOREIGN KEY (order_status_id) REFERENCES order_status (id)
);

-- migrate:down
DROP TABLE orders;
