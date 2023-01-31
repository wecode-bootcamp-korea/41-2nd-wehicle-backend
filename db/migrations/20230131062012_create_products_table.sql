-- migrate:up
CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  car_id INT NOT NULL,
  thumbnail VARCHAR(2000) NOT NULL,
  oil VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  mileage INT NOT NULL,
  price DECIMAL(12, 3) NOT NULL,
  inspection_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (car_id) REFERENCES cars (id)
);

-- migrate:down
DROP TABLE products;
