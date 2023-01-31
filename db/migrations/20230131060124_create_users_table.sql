-- migrate:up
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  social_id BIGINT NOT NULL,
  social_type_id INT NOT NULL,
  email VARCHAR(200) NOT NULL,
  name VARCHAR(50) NULL,
  nickname VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20) NULL,
  address VARCHAR(100) NULL,
  points DECIMAL(12, 3) NULL DEFAULT 100000000,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (social_type_id) REFERENCES social_types (id),
  CONSTRAINT users_ukey UNIQUE (social_id, email)
);

-- migrate:down
DROP TABLE users; 