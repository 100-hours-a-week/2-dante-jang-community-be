-- Active: 1730077218401@@127.0.0.1@3306@community_post_db
DROP TABLE IF EXISTS `post`;

CREATE TABLE `post` (
    `post_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` Int UNSIGNED NOT NULL COMMENT '유저 아이디',
    `title` VARCHAR(100) NOT NULL COMMENT '글 제목',
    `content` TEXT NOT NULL COMMENT '게시글 내용',
    `writed_at` DATETIME NOT NULL COMMENT '작성일',
    `deleted_at` DATETIME NULL COMMENT '삭제일',
    `view_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '조회수',
    `image_url` VARCHAR(255) NULL COMMENT '이미지 주소',
    PRIMARY KEY (`post_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '게시글';