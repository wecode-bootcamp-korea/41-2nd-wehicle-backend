-- migrate:up
CREATE TABLE payment_methods (
	id INT NOT NULL AUTO_INCREMENT,
	method VARCHAR(50) NOT NULL,
	PRIMARY KEY (id)
);

-- migrate:down
DROP TABLE payment_methods;
