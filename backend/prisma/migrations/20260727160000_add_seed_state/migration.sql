-- Registra cargas iniciais que devem acontecer somente uma vez.
-- Isso impede que conteúdos removidos pelo dashboard reapareçam em novos deploys.
CREATE TABLE `SeedState` (
  `key` VARCHAR(191) NOT NULL,
  `completedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
