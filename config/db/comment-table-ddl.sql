-- Active: 1730077218401@@127.0.0.1@3306@community_comment_db
DROP TABLE IF EXISTS `comment`;

CREATE TABLE `comment` (
    `comment_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` Int UNSIGNED NOT NULL COMMENT '유저 아이디',
    `post_id` INT UNSIGNED NOT NULL COMMENT '게시글 아이디',
    `content` VARCHAR(255) NOT NULL COMMENT '댓글 내용',
    `writed_at` DATETIME NOT NULL COMMENT '작성일',
    PRIMARY KEY (`comment_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '댓글';