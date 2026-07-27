-- Permite que cada integrante tenha vários links identificados por nome.
ALTER TABLE `TeamMember` ADD COLUMN `links` JSON NULL;

-- Migra o link único já existente para a nova estrutura sem perder dados.
UPDATE `TeamMember`
SET `links` = JSON_ARRAY(
  JSON_OBJECT(
    'name', CASE
      WHEN LOWER(`profileUrl`) LIKE '%lattes.cnpq.br%' THEN 'Lattes'
      WHEN LOWER(`profileUrl`) LIKE '%linkedin.com%' THEN 'LinkedIn'
      ELSE 'Site'
    END,
    'url', `profileUrl`
  )
)
WHERE `profileUrl` IS NOT NULL AND TRIM(`profileUrl`) <> '';
