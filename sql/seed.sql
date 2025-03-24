USE breaking_dance_competition;

-- 插入管理员用户
INSERT INTO users (username, password, role, name, email, phone)
VALUES 
('admin', '$2b$10$Yh9fzxc2ZQJ9uvEZ8s1G5.8S.KiSr/XP5Q2JZBoOG2TZ5AiUkxKz.', 'admin', '系统管理员', 'admin@breakdance.com', '13800000000'),
('judge1', '$2b$10$Yh9fzxc2ZQJ9uvEZ8s1G5.8S.KiSr/XP5Q2JZBoOG2TZ5AiUkxKz.', 'judge', '评委一', 'judge1@breakdance.com', '13800000001'),
('judge2', '$2b$10$Yh9fzxc2ZQJ9uvEZ8s1G5.8S.KiSr/XP5Q2JZBoOG2TZ5AiUkxKz.', 'judge', '评委二', 'judge2@breakdance.com', '13800000002'),
('staff1', '$2b$10$Yh9fzxc2ZQJ9uvEZ8s1G5.8S.KiSr/XP5Q2JZBoOG2TZ5AiUkxKz.', 'staff', '工作人员一', 'staff1@breakdance.com', '13800000003');

-- 插入比赛
INSERT INTO competitions (name, description, start_date, end_date, location, status)
VALUES 
('2023年全国霹雳舞锦标赛', '全国霹雳舞最高级别比赛', '2023-08-01', '2023-08-05', '北京体育馆', 'completed'),
('2024年全国霹雳舞锦标赛', '全国霹雳舞最高级别比赛', '2024-09-15', '2024-09-20', '上海体育馆', 'registration');

-- 插入参赛选手
INSERT INTO competitors (competition_id, registration_number, b_boy_name, real_name, gender, birth_date, nationality, team, status)
VALUES 
(1, 'BRK-2023-001', 'B-Boy Dragon', '张三', 'male', '1995-05-15', '中国', '北京霹雳队', 'qualified'),
(1, 'BRK-2023-002', 'B-Boy Phoenix', '李四', 'male', '1996-07-20', '中国', '上海霹雳队', 'qualified'),
(1, 'BRK-2023-003', 'B-Boy Tiger', '王五', 'male', '1994-03-10', '中国', '广州霹雳队', 'qualified'),
(1, 'BRK-2023-004', 'B-Girl Eagle', '赵六', 'female', '1997-11-25', '中国', '北京霹雳队', 'qualified'),
(1, 'BRK-2023-005', 'B-Boy Lion', '孙七', 'male', '1993-02-18', '中国', '上海霹雳队', 'qualified'),
(1, 'BRK-2023-006', 'B-Girl Lotus', '周八', 'female', '1996-09-30', '中国', '广州霹雳队', 'qualified'),
(1, 'BRK-2023-007', 'B-Boy Monkey', '吴九', 'male', '1995-08-12', '中国', '北京霹雳队', 'qualified'),
(1, 'BRK-2023-008', 'B-Boy Snake', '郑十', 'male', '1994-06-05', '中国', '上海霹雳队', 'qualified'),
(1, 'BRK-2023-009', 'B-Girl Swan', '陈十一', 'female', '1997-04-22', '中国', '广州霹雳队', 'qualified'),
(1, 'BRK-2023-010', 'B-Boy Hawk', '林十二', 'male', '1993-12-08', '中国', '北京霹雳队', 'qualified'),
(1, 'BRK-2023-011', 'B-Boy Panther', '黄十三', 'male', '1996-01-15', '中国', '上海霹雳队', 'qualified'),
(1, 'BRK-2023-012', 'B-Girl Butterfly', '徐十四', 'female', '1995-10-20', '中国', '广州霹雳队', 'qualified'),
(1, 'BRK-2023-013', 'B-Boy Wolf', '何十五', 'male', '1994-07-30', '中国', '北京霹雳队', 'qualified'),
(1, 'BRK-2023-014', 'B-Boy Bear', '高十六', 'male', '1993-05-17', '中国', '上海霹雳队', 'qualified'),
(1, 'BRK-2023-015', 'B-Girl Peacock', '马十七', 'female', '1997-03-25', '中国', '广州霹雳队', 'qualified'),
(1, 'BRK-2023-016', 'B-Boy Fox', '谢十八', 'male', '1996-11-12', '中国', '北京霹雳队', 'qualified');

-- 插入比赛阶段
INSERT INTO competition_stages (competition_id, name, description, stage_order, stage_type, status)
VALUES 
(1, '资格赛', '全国霹雳舞锦标赛资格赛', 1, 'qualification', 'completed'),
(1, '16强', '全国霹雳舞锦标赛16强赛', 2, 'top_16', 'completed'),
(1, '8强', '全国霹雳舞锦标赛8强赛', 3, 'top_8', 'completed'),
(1, '4强', '全国霹雳舞锦标赛4强赛', 4, 'top_4', 'completed'),
(1, '决赛', '全国霹雳舞锦标赛决赛', 5, 'final', 'completed');

-- 插入裁判
INSERT INTO judges (user_id, competition_id, name, description)
VALUES 
(2, 1, '评委一', '国际霹雳舞一级评判'),
(3, 1, '评委二', '国际霹雳舞二级评判');

-- 插入16强对阵
INSERT INTO battles (competition_id, stage_id, competitor1_id, competitor2_id, battle_order, winner_id, status)
VALUES 
(1, 2, 1, 16, 1, 1, 'completed'),
(1, 2, 8, 9, 2, 8, 'completed'),
(1, 2, 5, 12, 3, 5, 'completed'),
(1, 2, 4, 13, 4, 4, 'completed'),
(1, 2, 2, 15, 5, 2, 'completed'),
(1, 2, 7, 10, 6, 7, 'completed'),
(1, 2, 6, 11, 7, 6, 'completed'),
(1, 2, 3, 14, 8, 3, 'completed');

-- 插入8强对阵
INSERT INTO battles (competition_id, stage_id, competitor1_id, competitor2_id, battle_order, winner_id, status)
VALUES 
(1, 3, 1, 8, 1, 1, 'completed'),
(1, 3, 5, 4, 2, 4, 'completed'),
(1, 3, 2, 7, 3, 2, 'completed'),
(1, 3, 6, 3, 4, 3, 'completed');

-- 插入4强对阵
INSERT INTO battles (competition_id, stage_id, competitor1_id, competitor2_id, battle_order, winner_id, status)
VALUES 
(1, 4, 1, 4, 1, 1, 'completed'),
(1, 4, 2, 3, 2, 3, 'completed');

-- 插入决赛对阵
INSERT INTO battles (competition_id, stage_id, competitor1_id, competitor2_id, battle_order, winner_id, status)
VALUES 
(1, 5, 1, 3, 1, 1, 'completed');

-- 插入比赛结果
INSERT INTO competition_results (competition_id, competitor_id, final_rank)
VALUES 
(1, 1, 1),  -- 冠军
(1, 3, 2),  -- 亚军
(1, 2, 3),  -- 季军
(1, 4, 4);  -- 第四名 