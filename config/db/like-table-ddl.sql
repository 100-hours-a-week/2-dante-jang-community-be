DROP DATABASE IF EXISTS `community_like_db`;
CREATE DATABASE `community_like_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `community_like_db`;

DROP TABLE IF EXISTS `like`;

CREATE TABLE `like` (
    `like_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` Int UNSIGNED NOT NULL COMMENT '유저 아이디',
    `post_id` INT UNSIGNED NOT NULL COMMENT '게시글 아이디',
    `create_at` DATETIME NOT NULL COMMENT '생성일',
    PRIMARY KEY (`like_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '좋아요';