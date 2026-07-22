-- Limpeza unica solicitada: remove somente a VIII Mostra que ficou inacessivel em revisao.
DELETE FROM `Content`
WHERE `published` = false
  AND `type` = 'CINEMA_SHOW'
  AND UPPER(TRIM(`title`)) LIKE 'VIII %';
