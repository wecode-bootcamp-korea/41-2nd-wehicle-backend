-- migrate:up
CREATE TABLE coupon_types (
	id INT NOT NULL AUTO_INCREMENT,
	type VARCHAR(50),
	PRIMARY KEY (id)
);

-- migrate:down
DROP TABLE coupon_types;
