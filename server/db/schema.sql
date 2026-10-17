-- Mya Nyo Tea database schema (MySQL / MariaDB)
-- Create the database with utf8mb4 so Myanmar text is stored correctly:
--   CREATE DATABASE mya_nyo_tea CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admins (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name_en    VARCHAR(100) NOT NULL,
  name_mm    VARCHAR(100) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
) DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NULL,
  name_en     VARCHAR(150) NOT NULL,
  name_mm     VARCHAR(150) NOT NULL,
  flavor_en   VARCHAR(100),
  flavor_mm   VARCHAR(100),
  size        VARCHAR(50),
  price       INT UNSIGNED NOT NULL,
  in_stock    TINYINT(1) NOT NULL DEFAULT 1,
  image_url   VARCHAR(255),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
