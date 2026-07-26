-- Permite cadastrar autores de artigos como conteudos independentes.
ALTER TABLE `Content` MODIFY `type` ENUM('FILM', 'GLOSSARY', 'CINEMA_SHOW', 'ARTICLE', 'ARTICLE_AUTHOR', 'RESEARCH', 'TRANSLATION', 'VIRAL_ESCAPE_LINES', 'INTERVIEW', 'PODCAST', 'EVENT', 'OTHER') NOT NULL;

-- A VIII Mostra foi cadastrada pela coordenacao antes de novos conteudos dela
-- passarem a nascer publicados. Publica somente esse registro para liberar
-- sua pagina e as entradas dinamicas dos menus.
UPDATE `Content`
SET `published` = true
WHERE `published` = false
  AND `type` = 'CINEMA_SHOW'
  AND UPPER(TRIM(`title`)) LIKE 'VIII %';
