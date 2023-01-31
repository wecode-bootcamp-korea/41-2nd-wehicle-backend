-- migrate:up
CREATE TABLE brands (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

-- migrate:down
DROP TABLE brands;