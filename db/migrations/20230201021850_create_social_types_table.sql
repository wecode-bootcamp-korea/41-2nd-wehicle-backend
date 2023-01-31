-- migrate:up
CREATE TABLE social_types (
  id INT NOT NULL AUTO_INCREMENT,
  type VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
)

-- migrate:down
DROP TABLE social_types;
