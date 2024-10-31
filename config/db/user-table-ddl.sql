-- Active: 1730077218401@@127.0.0.1@3306@community_user_db
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
    `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL COMMENT '고객명',
    `email` VARCHAR(255) NOT NULL UNIQUE COMMENT '고객 이메일',
    `password` VARCHAR(255) NOT NULL COMMENT '고객 비밀번호',
    `created_at` DATETIME NOT NULL COMMENT '회원가입일',
    `deleted_at` DATETIME NULL COMMENT '탈퇴일',
    `profile_url` VARCHAR(255) NULL COMMENT '프로필 사진 주소',
    PRIMARY KEY (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '유저';