-- migrate:up
CREATE TABLE verification_codes (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    verify_code INT NOT NULL,
    active INT NOT NULL,
    verified INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    PRIMARY KEY(id)
);

-- migrate:down
DROP TABLE verify;
