-- migrate:up
CREATE TABLE cars (
  id INT NOT NULL AUTO_INCREMENT,
  brand_id INT,
  name VARCHAR(50) NOT NULL,
  thumbnail VARCHAR(2000) NOT NULL,
  size VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (brand_id) REFERENCES brands (id)
);

-- migrate:down
DROP TABLE cars;

