/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80019 (8.0.19)
 Source Host           : localhost:3306
 Source Schema         : breaking_dance_competition

 Target Server Type    : MySQL
 Target Server Version : 80019 (8.0.19)
 File Encoding         : 65001

 Date: 04/04/2025 17:11:31
*/

-- 创建 schema 并切换到 schema
-- create schema breaking_dance_competition collate utf8mb4_0900_ai_ci;
-- use breaking_dance_competition;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for battles
-- ----------------------------
DROP TABLE IF EXISTS `battles`;
CREATE TABLE `battles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `competition_id` int NOT NULL,
  `stage_id` int NOT NULL,
  `competitor1_id` int NULL DEFAULT NULL,
  `competitor2_id` int NULL DEFAULT NULL,
  `battle_order` int NOT NULL,
  `winner_id` int NULL DEFAULT NULL,
  `status` enum('scheduled','in_progress','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'scheduled',
  `start_time` datetime(3) NULL DEFAULT NULL,
  `end_time` datetime(3) NULL DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `battles_competition_id_fkey`(`competition_id` ASC) USING BTREE,
  INDEX `battles_stage_id_fkey`(`stage_id` ASC) USING BTREE,
  INDEX `battles_competitor1_id_fkey`(`competitor1_id` ASC) USING BTREE,
  INDEX `battles_competitor2_id_fkey`(`competitor2_id` ASC) USING BTREE,
  INDEX `battles_winner_id_fkey`(`winner_id` ASC) USING BTREE,
  CONSTRAINT `battles_competition_id_fkey` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `battles_competitor1_id_fkey` FOREIGN KEY (`competitor1_id`) REFERENCES `competitors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `battles_competitor2_id_fkey` FOREIGN KEY (`competitor2_id`) REFERENCES `competitors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `battles_stage_id_fkey` FOREIGN KEY (`stage_id`) REFERENCES `competition_stages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `battles_winner_id_fkey` FOREIGN KEY (`winner_id`) REFERENCES `competitors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of battles
-- ----------------------------
INSERT INTO `battles` VALUES (1, 1, 1, 1, 2, 1, NULL, 'scheduled', NULL, NULL, '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');
INSERT INTO `battles` VALUES (2, 1, 5, 1, 2, 1, 1, 'completed', '2025-03-26 12:00:00.000', '2025-03-26 13:00:00.000', '2025-03-26 15:32:18.154', '2025-03-26 15:32:18.154');
INSERT INTO `battles` VALUES (3, 1, 5, 1, 2, 1, 1, 'in_progress', '2025-03-25 16:00:00.000', '2025-03-26 14:00:00.000', '2025-03-26 15:34:03.849', '2025-03-29 14:25:21.652');
INSERT INTO `battles` VALUES (4, 1, 5, 1, 2, 1, 1, 'completed', '2025-03-25 16:00:00.000', '2025-03-26 14:00:00.000', '2025-03-26 15:34:31.094', '2025-03-29 14:25:04.712');

-- ----------------------------
-- Table structure for competition_results
-- ----------------------------
DROP TABLE IF EXISTS `competition_results`;
CREATE TABLE `competition_results`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `competition_id` int NOT NULL,
  `competitor_id` int NOT NULL,
  `final_rank` int NULL DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `competition_results_competition_id_competitor_id_key`(`competition_id` ASC, `competitor_id` ASC) USING BTREE,
  INDEX `competition_results_competitor_id_fkey`(`competitor_id` ASC) USING BTREE,
  CONSTRAINT `competition_results_competition_id_fkey` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `competition_results_competitor_id_fkey` FOREIGN KEY (`competitor_id`) REFERENCES `competitors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of competition_results
-- ----------------------------
INSERT INTO `competition_results` VALUES (1, 1, 1, 1, '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');
INSERT INTO `competition_results` VALUES (2, 1, 2, 2, '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');

-- ----------------------------
-- Table structure for competition_stages
-- ----------------------------
DROP TABLE IF EXISTS `competition_stages`;
CREATE TABLE `competition_stages`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `competition_id` int NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `stage_order` int NOT NULL,
  `stage_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `start_time` datetime(3) NULL DEFAULT NULL,
  `end_time` datetime(3) NULL DEFAULT NULL,
  `status` enum('pending','in_progress','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'pending',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `competition_stages_competition_id_fkey`(`competition_id` ASC) USING BTREE,
  CONSTRAINT `competition_stages_competition_id_fkey` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of competition_stages
-- ----------------------------
INSERT INTO `competition_stages` VALUES (1, 1, 'Qualification Round', 'Initial qualification round', 1, 'qualification', NULL, NULL, 'pending', '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');
INSERT INTO `competition_stages` VALUES (2, 1, 'Top 16', 'Top 16 battles', 2, 'top_16', NULL, NULL, 'pending', '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');
INSERT INTO `competition_stages` VALUES (3, 1, 'Top 8', 'Quarter finals', 3, 'top_8', NULL, NULL, 'pending', '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');
INSERT INTO `competition_stages` VALUES (4, 1, 'Top 4', 'Semi finals', 4, 'top_4', NULL, NULL, 'pending', '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');
INSERT INTO `competition_stages` VALUES (5, 1, 'Final', 'Final battle', 5, 'final', NULL, NULL, 'pending', '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');
INSERT INTO `competition_stages` VALUES (6, 4, '预选赛', '16进8淘汰赛', 1, 'qualification', '2023-04-01 10:00:00.000', '2023-04-03 18:00:00.000', 'pending', '2025-03-29 04:15:09.476', '2025-03-29 04:26:23.783');
INSERT INTO `competition_stages` VALUES (7, 4, 'TOP2', 'fdafadf', 0, 'final', '2025-04-29 16:00:00.000', '2025-04-30 16:00:00.000', 'pending', '2025-04-04 07:49:52.592', '2025-04-04 07:49:52.592');

-- ----------------------------
-- Table structure for competitions
-- ----------------------------
DROP TABLE IF EXISTS `competitions`;
CREATE TABLE `competitions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `location` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `max_participants` int NOT NULL DEFAULT 32,
  `registration_deadline` date NULL DEFAULT NULL,
  `status` enum('draft','registration','in_progress','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'draft',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of competitions
-- ----------------------------
INSERT INTO `competitions` VALUES (1, 'Breaking Battle 2024', 'Annual breaking competition', '2024-06-01', '2024-06-03', 'Main Arena', 32, '2024-05-15', 'registration', '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');
INSERT INTO `competitions` VALUES (3, '2023年全国霹雳舞锦标赛1', '2023年全国霹雳舞锦标赛1', '2025-03-30', '2025-04-01', '北京', 4, '2025-04-05', 'draft', '2025-03-26 14:26:13.000', '2025-03-26 14:26:13.000');
INSERT INTO `competitions` VALUES (4, '比赛2-id4', '这是比赛2', '2019-08-12', '2019-08-24', '北京', 32, '2019-08-20', 'draft', '2025-03-29 03:36:17.517', '2025-03-29 04:43:24.035');
INSERT INTO `competitions` VALUES (6, '2023年全国霹雳舞锦标赛2', '2023年全国霹雳舞锦标赛2描述', '2025-03-29', '2025-04-03', '北京', 12, '2025-04-01', 'draft', '2025-03-29 07:36:16.179', '2025-03-29 07:36:16.179');
INSERT INTO `competitions` VALUES (7, '2023年全国霹雳舞锦标赛2', '2023年全国霹雳舞锦标赛2描述', '2025-03-29', '2025-04-03', '北京', 12, '2025-04-01', 'draft', '2025-03-29 07:36:37.782', '2025-03-29 07:36:37.782');

-- ----------------------------
-- Table structure for competitors
-- ----------------------------
DROP TABLE IF EXISTS `competitors`;
CREATE TABLE `competitors`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NULL DEFAULT NULL,
  `competition_id` int NOT NULL,
  `registration_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `b_boy_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `real_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `gender` enum('male','female','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `birth_date` date NULL DEFAULT NULL,
  `nationality` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `team` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `photo_url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` enum('registered','qualified','eliminated') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'registered',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `competitors_registration_number_key`(`registration_number` ASC) USING BTREE,
  INDEX `competitors_user_id_fkey`(`user_id` ASC) USING BTREE,
  INDEX `competitors_competition_id_fkey`(`competition_id` ASC) USING BTREE,
  CONSTRAINT `competitors_competition_id_fkey` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `competitors_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of competitors
-- ----------------------------
INSERT INTO `competitors` VALUES (1, 4, 1, 'REG001', 'B-Boy One', 'John Doe', 'male', '2025-04-09', 'USA', 'Team A', 'http://dummyimage.com/400x400', 'registered', '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');
INSERT INTO `competitors` VALUES (2, 5, 1, 'REG002', 'B-Boy Two', 'Jane Smith', 'male', '2025-04-03', 'Canada', 'Team B', 'http://dummyimage.com/400x400', 'registered', '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');
INSERT INTO `competitors` VALUES (3, 8, 1, '45', '素需部先件产', '委区论压往统专', 'female', '1975-08-24', 'us', 'team3', 'http://dummyimage.com/400x400', 'eliminated', '2025-03-29 07:30:51.893', '2025-03-29 07:34:21.982');
INSERT INTO `competitors` VALUES (4, NULL, 1, '34', 'y哥', '选手y', 'male', '2025-04-01', 'us', 'team5', 'http://dummyimage.com/400x400', 'registered', '2025-03-29 13:17:30.907', '2025-03-29 13:17:30.907');

-- ----------------------------
-- Table structure for judges
-- ----------------------------
DROP TABLE IF EXISTS `judges`;
CREATE TABLE `judges`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `competition_id` int NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `judges_user_id_fkey`(`user_id` ASC) USING BTREE,
  INDEX `judges_competition_id_fkey`(`competition_id` ASC) USING BTREE,
  CONSTRAINT `judges_competition_id_fkey` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `judges_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of judges
-- ----------------------------
INSERT INTO `judges` VALUES (1, 2, 1, 'Judge One', 'Professional breaking judge', '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');

-- ----------------------------
-- Table structure for scores
-- ----------------------------
DROP TABLE IF EXISTS `scores`;
CREATE TABLE `scores`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `battle_id` int NOT NULL,
  `judge_id` int NOT NULL,
  `competitor_id` int NOT NULL,
  `technique_score` decimal(5, 2) NULL DEFAULT NULL,
  `originality_score` decimal(5, 2) NULL DEFAULT NULL,
  `musicality_score` decimal(5, 2) NULL DEFAULT NULL,
  `execution_score` decimal(5, 2) NULL DEFAULT NULL,
  `comments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `scores_battle_id_judge_id_competitor_id_key`(`battle_id` ASC, `judge_id` ASC, `competitor_id` ASC) USING BTREE,
  INDEX `scores_judge_id_fkey`(`judge_id` ASC) USING BTREE,
  INDEX `scores_competitor_id_fkey`(`competitor_id` ASC) USING BTREE,
  CONSTRAINT `scores_battle_id_fkey` FOREIGN KEY (`battle_id`) REFERENCES `battles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `scores_competitor_id_fkey` FOREIGN KEY (`competitor_id`) REFERENCES `competitors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `scores_judge_id_fkey` FOREIGN KEY (`judge_id`) REFERENCES `judges` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of scores
-- ----------------------------
INSERT INTO `scores` VALUES (2, 1, 1, 2, 8.00, 8.50, 8.00, 8.50, 'Excellent moves', '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');
INSERT INTO `scores` VALUES (5, 4, 1, 1, 6.00, 9.00, 8.00, 4.00, 'good-good', '2025-03-27 15:12:32.112', '2025-03-27 15:23:53.451');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` enum('admin','judge','competitor','staff') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'competitor',
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `users_username_key`(`username` ASC) USING BTREE,
  UNIQUE INDEX `users_email_key`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', '$2b$10$YourHashedPasswordHere', 'admin', 'Admin User', 'admin@example.com', NULL, '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');
INSERT INTO `users` VALUES (2, 'judge1', '$2b$10$YourHashedPasswordHere', 'judge', 'Judge One', 'judge1@example.com', NULL, '2025-03-26 22:18:20.000', '2025-04-02 14:15:47.069');
INSERT INTO `users` VALUES (4, 'competitor1', '$2b$10$YourHashedPasswordHere', 'competitor', 'Competitor One', 'competitor1@example.com', NULL, '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');
INSERT INTO `users` VALUES (5, 'competitor2', '$2b$10$YourHashedPasswordHere', 'competitor', 'Competitor Two', 'competitor2@example.com', NULL, '2025-03-26 22:18:20.000', '2025-03-26 22:18:20.000');
INSERT INTO `users` VALUES (6, 'admin123', '$2b$10$QA.9KsYoMemfZLg8HJupcuBZIc9LlUYuhpvsGlvM/NL3PUc8h5Zsa', 'admin', 'admin123', 'admin123@example.com', '13932316900', '2025-03-26 14:25:27.000', '2025-03-26 14:25:27.000');
INSERT INTO `users` VALUES (8, 'competitor123', '$2b$10$yNmBxisJsaLy9EbPml9Gy.6CItYKL7k.I1jYqne6FExl3V.Bcyr1K', 'competitor', 'competitor123', 'competitor123@example.com', '13932310110', '2025-03-27 14:16:26.091', '2025-03-27 14:16:26.091');
INSERT INTO `users` VALUES (9, 'competitor6', 'competitor6', 'competitor', 'competitor6', 'competitor6@example.com', '13932310021', '2025-04-01 23:15:37.154', '2025-04-01 23:15:37.154');
INSERT INTO `users` VALUES (10, 'staff1', 'staff1', 'staff', 'staff1', 'staff1@qq.com', '13012345678', '2025-04-02 14:33:14.272', '2025-04-02 14:33:14.272');

SET FOREIGN_KEY_CHECKS = 1;
