CREATE DATABASE rest_api_db;
USE rest_api_db;

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tag VARCHAR(50),
    image_url VARCHAR(255)
);
