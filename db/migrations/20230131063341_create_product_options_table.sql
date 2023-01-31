-- migrate:up
CREATE TABLE product_options (
  id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  color VARCHAR(50) NOT NULL,
  sunroof BOOLEAN NOT NULL,
  parkingsensor BOOLEAN NOT NULL,
  backcamera BOOLEAN NOT NULL,
  navi BOOLEAN NOT NULL,
  heatingseat BOOLEAN NOT NULL,
  coolingseat BOOLEAN NOT NULL,
  smartkey BOOLEAN NOT NULL,
  leatherseat BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

-- migrate:down
DROP TABLE product_options;
