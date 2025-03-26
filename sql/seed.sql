USE breaking_dance_competition;

-- 清空所有表
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE competition_results;
TRUNCATE TABLE scores;
TRUNCATE TABLE battles;
TRUNCATE TABLE judges;
TRUNCATE TABLE competitors;
TRUNCATE TABLE competition_stages;
TRUNCATE TABLE competitions;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 插入管理员用户
INSERT INTO users (username, password, role, name, email) VALUES
('admin', '$2b$10$YourHashedPasswordHere', 'admin', 'Admin User', 'admin@example.com');

-- 插入评委用户
INSERT INTO users (username, password, role, name, email) VALUES
('judge1', '$2b$10$YourHashedPasswordHere', 'judge', 'Judge One', 'judge1@example.com'),
('judge2', '$2b$10$YourHashedPasswordHere', 'judge', 'Judge Two', 'judge2@example.com');

-- 插入选手用户
INSERT INTO users (username, password, role, name, email) VALUES
('competitor1', '$2b$10$YourHashedPasswordHere', 'competitor', 'Competitor One', 'competitor1@example.com'),
('competitor2', '$2b$10$YourHashedPasswordHere', 'competitor', 'Competitor Two', 'competitor2@example.com');

-- 插入比赛
INSERT INTO competitions (name, description, start_date, end_date, location, max_participants, registration_deadline, status) VALUES
('Breaking Battle 2024', 'Annual breaking competition', '2024-06-01', '2024-06-03', 'Main Arena', 32, '2024-05-15', 'registration'),
('Summer Battle 2024', 'Summer breaking competition', '2024-08-15', '2024-08-17', 'City Center', 32, '2024-07-30', 'draft');

-- 插入比赛阶段
INSERT INTO competition_stages (competition_id, name, description, stage_order, stage_type, status) VALUES
(1, 'Qualification Round', 'Initial qualification round', 1, 'qualification', 'pending'),
(1, 'Top 16', 'Top 16 battles', 2, 'top_16', 'pending'),
(1, 'Top 8', 'Quarter finals', 3, 'top_8', 'pending'),
(1, 'Top 4', 'Semi finals', 4, 'top_4', 'pending'),
(1, 'Final', 'Final battle', 5, 'final', 'pending');

-- 插入选手
INSERT INTO competitors (user_id, competition_id, registration_number, b_boy_name, real_name, gender, nationality, team, status) VALUES
(4, 1, 'REG001', 'B-Boy One', 'John Doe', 'male', 'USA', 'Team A', 'registered'),
(5, 1, 'REG002', 'B-Boy Two', 'Jane Smith', 'male', 'Canada', 'Team B', 'registered');

-- 插入评委
INSERT INTO judges (user_id, competition_id, name, description) VALUES
(2, 1, 'Judge One', 'Professional breaking judge'),
(3, 1, 'Judge Two', 'Experienced breaking judge');

-- 插入对战
INSERT INTO battles (competition_id, stage_id, competitor1_id, competitor2_id, battle_order, status) VALUES
(1, 1, 1, 2, 1, 'scheduled');

-- 插入评分
INSERT INTO scores (battle_id, judge_id, competitor_id, technique_score, originality_score, musicality_score, execution_score, comments) VALUES
(1, 1, 1, 8.5, 8.0, 8.5, 8.0, 'Great performance'),
(1, 1, 2, 8.0, 8.5, 8.0, 8.5, 'Excellent moves'),
(1, 2, 1, 8.5, 8.5, 8.0, 8.5, 'Strong technique'),
(1, 2, 2, 8.0, 8.0, 8.5, 8.0, 'Creative style');

-- 插入比赛结果
INSERT INTO competition_results (competition_id, competitor_id, final_rank) VALUES
(1, 1, 1),
(1, 2, 2); 