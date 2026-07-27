-- Guarda propostas de edição enviadas pela equipe até a decisão da coordenação.
CREATE TABLE `TeamMemberChange` (
  `id` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
  `payload` JSON NOT NULL,
  `teamMemberId` VARCHAR(191) NOT NULL,
  `submittedById` VARCHAR(191) NOT NULL,
  `reviewedById` VARCHAR(191) NULL,
  `reviewedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `TeamMemberChange_status_createdAt_idx`(`status`, `createdAt`),
  INDEX `TeamMemberChange_teamMemberId_idx`(`teamMemberId`),
  INDEX `TeamMemberChange_submittedById_idx`(`submittedById`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `TeamMemberChange`
  ADD CONSTRAINT `TeamMemberChange_teamMemberId_fkey`
  FOREIGN KEY (`teamMemberId`) REFERENCES `TeamMember`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `TeamMemberChange`
  ADD CONSTRAINT `TeamMemberChange_submittedById_fkey`
  FOREIGN KEY (`submittedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `TeamMemberChange`
  ADD CONSTRAINT `TeamMemberChange_reviewedById_fkey`
  FOREIGN KEY (`reviewedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
