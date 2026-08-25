-- Mantém os blocos adicionais de todas as pesquisas em uma única coluna.
UPDATE `Content`
SET `metadata` = JSON_SET(
  COALESCE(`metadata`, JSON_OBJECT()),
  '$.additionalInfoLayout',
  'ONE_COLUMN'
)
WHERE `type` = 'RESEARCH';
