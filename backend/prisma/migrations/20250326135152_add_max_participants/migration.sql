-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'judge', 'competitor', 'staff') NOT NULL DEFAULT 'competitor',
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competitions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `location` VARCHAR(191) NULL,
    `max_participants` INTEGER NOT NULL DEFAULT 32,
    `status` ENUM('draft', 'registration', 'in_progress', 'completed') NOT NULL DEFAULT 'draft',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competitors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `competition_id` INTEGER NOT NULL,
    `registration_number` VARCHAR(191) NULL,
    `b_boy_name` VARCHAR(191) NULL,
    `real_name` VARCHAR(191) NOT NULL,
    `gender` ENUM('male', 'female', 'other') NOT NULL,
    `birth_date` DATE NULL,
    `nationality` VARCHAR(191) NULL,
    `team` VARCHAR(191) NULL,
    `photo_url` VARCHAR(191) NULL,
    `status` ENUM('registered', 'qualified', 'eliminated') NOT NULL DEFAULT 'registered',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `competitors_registration_number_key`(`registration_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competition_stages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `competition_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `stage_order` INTEGER NOT NULL,
    `stageType` ENUM('qualification', 'top_16', 'top_8', 'top_4', 'final') NOT NULL,
    `start_time` DATETIME(3) NULL,
    `end_time` DATETIME(3) NULL,
    `status` ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `competition_id` INTEGER NOT NULL,
    `stage_id` INTEGER NOT NULL,
    `competitor1_id` INTEGER NULL,
    `competitor2_id` INTEGER NULL,
    `battle_order` INTEGER NOT NULL,
    `winner_id` INTEGER NULL,
    `status` ENUM('scheduled', 'in_progress', 'completed') NOT NULL DEFAULT 'scheduled',
    `start_time` DATETIME(3) NULL,
    `end_time` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `judges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `competition_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `battle_id` INTEGER NOT NULL,
    `judge_id` INTEGER NOT NULL,
    `competitor_id` INTEGER NOT NULL,
    `technique_score` DECIMAL(5, 2) NULL,
    `originality_score` DECIMAL(5, 2) NULL,
    `musicality_score` DECIMAL(5, 2) NULL,
    `execution_score` DECIMAL(5, 2) NULL,
    `comments` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `scores_battle_id_judge_id_competitor_id_key`(`battle_id`, `judge_id`, `competitor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competition_results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `competition_id` INTEGER NOT NULL,
    `competitor_id` INTEGER NOT NULL,
    `final_rank` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `competition_results_competition_id_competitor_id_key`(`competition_id`, `competitor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `competitors` ADD CONSTRAINT `competitors_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competitors` ADD CONSTRAINT `competitors_competition_id_fkey` FOREIGN KEY (`competition_id`) REFERENCES `competitions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competition_stages` ADD CONSTRAINT `competition_stages_competition_id_fkey` FOREIGN KEY (`competition_id`) REFERENCES `competitions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battles` ADD CONSTRAINT `battles_competition_id_fkey` FOREIGN KEY (`competition_id`) REFERENCES `competitions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battles` ADD CONSTRAINT `battles_stage_id_fkey` FOREIGN KEY (`stage_id`) REFERENCES `competition_stages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battles` ADD CONSTRAINT `battles_competitor1_id_fkey` FOREIGN KEY (`competitor1_id`) REFERENCES `competitors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battles` ADD CONSTRAINT `battles_competitor2_id_fkey` FOREIGN KEY (`competitor2_id`) REFERENCES `competitors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `battles` ADD CONSTRAINT `battles_winner_id_fkey` FOREIGN KEY (`winner_id`) REFERENCES `competitors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `judges` ADD CONSTRAINT `judges_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `judges` ADD CONSTRAINT `judges_competition_id_fkey` FOREIGN KEY (`competition_id`) REFERENCES `competitions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scores` ADD CONSTRAINT `scores_battle_id_fkey` FOREIGN KEY (`battle_id`) REFERENCES `battles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scores` ADD CONSTRAINT `scores_judge_id_fkey` FOREIGN KEY (`judge_id`) REFERENCES `judges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scores` ADD CONSTRAINT `scores_competitor_id_fkey` FOREIGN KEY (`competitor_id`) REFERENCES `competitors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competition_results` ADD CONSTRAINT `competition_results_competition_id_fkey` FOREIGN KEY (`competition_id`) REFERENCES `competitions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competition_results` ADD CONSTRAINT `competition_results_competitor_id_fkey` FOREIGN KEY (`competitor_id`) REFERENCES `competitors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
