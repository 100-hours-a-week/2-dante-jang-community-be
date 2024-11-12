DROP DATABASE IF EXISTS `community_image_db`;
CREATE DATABASE `community_image_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `community_image_db`;

DROP TABLE IF EXISTS `image`;

CREATE TABLE `image` (
    `image_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `url` TEXT NOT NULL UNIQUE COMMENT '이미지 주소',
    PRIMARY KEY (`image_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '이미지';