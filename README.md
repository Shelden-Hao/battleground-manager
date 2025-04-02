# 霹雳舞比赛管理系统 (Breaking Dance Competition Management System)

一个完整的霹雳舞比赛赛事管理系统，包含选手报名、对阵安排、评分系统等功能。

## 项目结构

项目分为三个主要部分：

1. **前端 (frontend)**：使用 React + Umi + Ant Design Pro + ProComponents 开发
2. **后端 (backend)**：使用 NestJS + Prisma + MySQL 开发
3. **数据库 (sql)**：MySQL 数据库脚本

## 功能特点

- 用户管理（管理员、评委、选手、工作人员）
- 比赛管理（创建、编辑、删除比赛）
- 选手管理（报名、资格审核）
- 比赛阶段管理（资格赛、16强、8强、4强、决赛）
- 对阵管理（自动/手动对阵安排）
- 评分系统（技术、创意、音乐性、执行力）
- 比赛结果统计

## 安装和使用

### 数据库配置

1. 创建 MySQL 数据库 `breaking_dance_competition`
2. 执行 `sql/breaking_dance_competition.sql` 脚本创建表结构，并填充初始数据
3. 进入后端目录：`cd backend`，在 `.env` 中将 `DATABASE_URL` 设置数据库连接地址(更改为自己的数据库用户名和密码)

### 后端配置

1. 进入后端目录：`cd backend`
2. 安装依赖：`npm install`
3. 修改 `.env` 文件中的数据库连接信息(更改为自己的数据库用户名和密码)
4. 开发模式启动：`npm run start:dev`
5. 或生产模式构建：`npm run build` 然后 `npm run start:prod`

### 前端配置

1. 进入前端目录：`cd frontend`
2. 安装依赖：`npm install`
3. 开发模式启动：`npm run dev`
4. 或生产模式构建：`npm run build`

## 系统角色

- **管理员**：系统管理、用户管理、比赛全流程管理
- **评委**：评分、查看比赛信息
- **选手**：报名、查看自己的比赛信息和成绩
- **工作人员**：协助管理比赛、选手和对阵

## 技术栈

### 前端

- React
- Umi
- Ant Design
- Ant Design Pro
- ProComponents
- TypeScript

### 后端

- NestJS
- Prisma ORM
- MySQL
- JWT 认证
- Swagger API 文档

## 预设账号

- 管理员：admin123 / admin123
