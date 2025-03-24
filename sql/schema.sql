-- 创建数据库
CREATE DATABASE IF NOT EXISTS breaking_dance_competition;
USE breaking_dance_competition;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'judge', 'competitor', 'staff') NOT NULL DEFAULT 'competitor',
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 比赛表
CREATE TABLE IF NOT EXISTS competitions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location VARCHAR(255),
  status ENUM('draft', 'registration', 'in_progress', 'completed') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 参赛选手信息表
CREATE TABLE IF NOT EXISTS competitors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  competition_id INT NOT NULL,
  registration_number VARCHAR(20) UNIQUE,
  b_boy_name VARCHAR(50),
  real_name VARCHAR(100) NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  birth_date DATE,
  nationality VARCHAR(50),
  team VARCHAR(100),
  photo_url VARCHAR(255),
  status ENUM('registered', 'qualified', 'eliminated') DEFAULT 'registered',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE
);

-- 比赛阶段表
CREATE TABLE IF NOT EXISTS competition_stages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  competition_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  stage_order INT NOT NULL,
  stage_type ENUM('qualification', 'top_16', 'top_8', 'top_4', 'final') NOT NULL,
  start_time DATETIME,
  end_time DATETIME,
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE
);

-- 对阵表
CREATE TABLE IF NOT EXISTS battles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  competition_id INT NOT NULL,
  stage_id INT NOT NULL,
  competitor1_id INT,
  competitor2_id INT,
  battle_order INT NOT NULL,
  winner_id INT,
  status ENUM('scheduled', 'in_progress', 'completed') DEFAULT 'scheduled',
  start_time DATETIME,
  end_time DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
  FOREIGN KEY (stage_id) REFERENCES competition_stages(id) ON DELETE CASCADE,
  FOREIGN KEY (competitor1_id) REFERENCES competitors(id) ON DELETE SET NULL,
  FOREIGN KEY (competitor2_id) REFERENCES competitors(id) ON DELETE SET NULL,
  FOREIGN KEY (winner_id) REFERENCES competitors(id) ON DELETE SET NULL
);

-- 裁判表
CREATE TABLE IF NOT EXISTS judges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  competition_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE
);

-- 评分表
CREATE TABLE IF NOT EXISTS scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  battle_id INT NOT NULL,
  judge_id INT NOT NULL,
  competitor_id INT NOT NULL,
  technique_score DECIMAL(5,2),
  originality_score DECIMAL(5,2),
  musicality_score DECIMAL(5,2),
  execution_score DECIMAL(5,2),
  total_score DECIMAL(5,2) GENERATED ALWAYS AS (technique_score + originality_score + musicality_score + execution_score) STORED,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (battle_id) REFERENCES battles(id) ON DELETE CASCADE,
  FOREIGN KEY (judge_id) REFERENCES judges(id) ON DELETE CASCADE,
  FOREIGN KEY (competitor_id) REFERENCES competitors(id) ON DELETE CASCADE,
  UNIQUE KEY (battle_id, judge_id, competitor_id)
);

-- 比赛结果表
CREATE TABLE IF NOT EXISTS competition_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  competition_id INT NOT NULL,
  competitor_id INT NOT NULL,
  final_rank INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
  FOREIGN KEY (competitor_id) REFERENCES competitors(id) ON DELETE CASCADE,
  UNIQUE KEY (competition_id, competitor_id)
); 