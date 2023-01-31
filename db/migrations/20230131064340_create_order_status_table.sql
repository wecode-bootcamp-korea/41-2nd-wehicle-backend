-- migrate:up
CREATE TABLE order_status (
	id INT NOT NULL AUTO_INCREMENT,
	status VARCHAR(50) NOT NULL,
	PRIMARY KEY (id)
);

-- migrate:down
DROP TABLE order_status;
