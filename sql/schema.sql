-- 创建数据库
CREATE DATABASE IF NOT EXISTS breaking_dance_competition;
USE breaking_dance_competition;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(255) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    role ENUM('admin', 'judge', 'competitor', 'staff') DEFAULT 'competitor' COMMENT '角色',
    name VARCHAR(255) COMMENT '真实姓名',
    email VARCHAR(255) UNIQUE COMMENT '电子邮件',
    phone VARCHAR(50) COMMENT '电话号码',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);

-- 创建比赛表
CREATE TABLE IF NOT EXISTS competitions (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '比赛ID',
    name VARCHAR(255) NOT NULL COMMENT '比赛名称',
    description TEXT COMMENT '比赛描述',
    start_date DATE NOT NULL COMMENT '开始日期',
    end_date DATE NOT NULL COMMENT '结束日期',
    location VARCHAR(255) COMMENT '比赛地点',
    max_participants INT DEFAULT 32 COMMENT '最大参赛人数',
    registration_deadline DATE COMMENT '注册截止日期',
    status ENUM('draft', 'registration', 'in_progress', 'completed') DEFAULT 'draft' COMMENT '比赛状态 默认为草稿(draft) 注册中(registration) 进行中(in_progress) 已完成(completed)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);

-- 创建选手表
CREATE TABLE IF NOT EXISTS competitors (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '选手ID',
    user_id INT COMMENT '用户ID',
    competition_id INT NOT NULL COMMENT '比赛ID',
    registration_number VARCHAR(50) UNIQUE COMMENT '注册编号',
    b_boy_name VARCHAR(255) COMMENT 'B-boy名称',
    real_name VARCHAR(255) NOT NULL COMMENT '真实姓名',
    gender ENUM('male', 'female', 'other') NOT NULL COMMENT '性别',
    birth_date DATE COMMENT '出生日期',
    nationality VARCHAR(100) COMMENT '国籍',
    team VARCHAR(255) COMMENT '队伍',
    photo_url VARCHAR(255) COMMENT '照片URL',
    status ENUM('registered', 'qualified', 'eliminated') DEFAULT 'registered' COMMENT '状态 默认为注册(registered) qualified为优胜 eliminated为淘汰',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE
);

-- 创建比赛阶段表
CREATE TABLE IF NOT EXISTS competition_stages (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '阶段ID',
    competition_id INT NOT NULL COMMENT '比赛ID',
    name VARCHAR(255) NOT NULL COMMENT '阶段名称',
    description TEXT COMMENT '阶段描述',
    stage_order INT NOT NULL COMMENT '阶段顺序',
    stage_type ENUM('qualification', 'top_16', 'top_8', 'top_4', 'final') NOT NULL COMMENT '阶段类型',
    start_time DATETIME COMMENT '开始时间',
    end_time DATETIME COMMENT '结束时间',
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending' COMMENT '阶段状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE
);

-- 创建对战表
CREATE TABLE IF NOT EXISTS battles (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '对战ID',
    competition_id INT NOT NULL COMMENT '比赛ID',
    stage_id INT NOT NULL COMMENT '阶段ID',
    competitor1_id INT COMMENT '选手1ID',
    competitor2_id INT COMMENT '选手2ID',
    battle_order INT NOT NULL COMMENT '对战顺序',
    winner_id INT COMMENT '胜者ID',
    status ENUM('scheduled', 'in_progress', 'completed') DEFAULT 'scheduled' COMMENT '对战状态 默认为scheduled准备中 in_progress为比赛进行中 completed为比赛完成',
    start_time DATETIME COMMENT '开始时间',
    end_time DATETIME COMMENT '结束时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
    FOREIGN KEY (stage_id) REFERENCES competition_stages(id) ON DELETE CASCADE,
    FOREIGN KEY (competitor1_id) REFERENCES competitors(id) ON DELETE SET NULL,
    FOREIGN KEY (competitor2_id) REFERENCES competitors(id) ON DELETE SET NULL,
    FOREIGN KEY (winner_id) REFERENCES competitors(id) ON DELETE SET NULL
);

-- 创建评委表
CREATE TABLE IF NOT EXISTS judges (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '评委ID',
    user_id INT NOT NULL COMMENT '用户ID',
    competition_id INT NOT NULL COMMENT '比赛ID',
    name VARCHAR(255) NOT NULL COMMENT '评委姓名',
    description TEXT COMMENT '评委描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE
);

-- 创建评分表
CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '评分ID',
    battle_id INT NOT NULL COMMENT '对战ID',
    judge_id INT NOT NULL COMMENT '评委ID',
    competitor_id INT NOT NULL COMMENT '选手ID',
    technique_score DECIMAL(5,2) COMMENT '技术评分',
    originality_score DECIMAL(5,2) COMMENT '原创性评分',
    musicality_score DECIMAL(5,2) COMMENT '音乐性评分',
    execution_score DECIMAL(5,2) COMMENT '执行评分',
    comments TEXT COMMENT '评分评论',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (battle_id) REFERENCES battles(id) ON DELETE CASCADE,
    FOREIGN KEY (judge_id) REFERENCES judges(id) ON DELETE CASCADE,
    FOREIGN KEY (competitor_id) REFERENCES competitors(id) ON DELETE CASCADE,
    UNIQUE KEY unique_score (battle_id, judge_id, competitor_id)
);

-- 创建比赛结果表
CREATE TABLE IF NOT EXISTS competition_results (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '结果ID',
    competition_id INT NOT NULL COMMENT '比赛ID',
    competitor_id INT NOT NULL COMMENT '选手ID',
    final_rank INT COMMENT '最终排名',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
    FOREIGN KEY (competitor_id) REFERENCES competitors(id) ON DELETE CASCADE,
    UNIQUE KEY unique_result (competition_id, competitor_id)
);
