require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [{
  title: "Eles Não Usam Black-Tie",
  youtubeId: "Uzl2K1bDRog",
  description: "Otávio é um militante sindical que organiza um movimento grevista para resistir as práticas exploradoras de uma metalúrgica, onde seu filho Tião trabalha. Mas com a namorada grávida, Tião resiste à greve para não perder o emprego.",
  director: "Leon Hirszman",
  genre: "Drama",
  country: "Brasil",
  year: "1981",
  duration: "134 min",
}, {
  title: "Em Nome da Segurança Nacional",
  vimeoId: "207474104",
  externalUrl: "https://vimeo.com/207474104",
  description: `Em Nome da Segurança Nacional tem como eixo narrativo O Tribunal Tiradentes, organizado pela Comissão Justiça e Paz da Arquidiocese de São Paulo em 1983. O filme acrescenta às cenas do Tribunal diversos materiais, tanto de arquivo quanto ficcionais, e discute a Doutrina de Segurança Nacional, eixo ideológico da ditadura implantada pelo golpe de 1964, e o efeito que ela teve sobre diversos segmentos da sociedade brasileira.

Filme produzido pelo Instituto Macuco, no âmbito do projeto Marcas da Memória, do Ministério da Justiça.`,
  director: "Renato Tapajós",
  genre: "Documentário",
  country: "Brasil",
  year: "2012",
  duration: "45 min",
}, {
  title: "Entre Imagens – Intervalos",
  youtubeId: "XMkO0jIc3V4",
  description: `“Entre Imagens - (Intervalos)” é um documentário produzido como parte do projeto da exposição “Antonio Benetazzo, permanências do sensível”, com pesquisa e curadoria de Reinaldo Cardenuto. O filme-ensaio trata da vida e da obra do artista ítalo-brasileiro, morto em 1972 pela ditadura militar no Brasil. Com direção de André Fratti Costa e Reinaldo Cardenuto, o documentário foi exibido em importantes festivais, como a 19ª Mostra de Cinema de Tiradentes, Mostra de Curta CCBB, 16ª Mostra de Curta Goiânia, a mostra francesa Brésil en Mouvement e VII Festival Pachamama, onde foi premiado na categoria Melhor Curta Metragem.`,
  director: "André Fratti Costa e Reinaldo Cardenuto",
  genre: "Documentário",
  country: "Brasil",
  year: "2016",
  duration: "22 min",
}];

async function main() {
  const importer = await prisma.user.findUnique({ where: { email: "importacao-acervo@lace.local" } });
  if (!importer) throw new Error("Usuário de importação do acervo não encontrado.");

  for (const film of films) {
    const externalUrl = film.externalUrl || `https://www.youtube.com/watch?v=${film.youtubeId}`;
    const metadata = { youtubeId: film.youtubeId, vimeoId: film.vimeoId, videoProvider: film.vimeoId ? "vimeo" : "youtube", imageUrl: film.youtubeId ? `https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg` : null, director: film.director, genre: film.genre, country: film.country, year: film.year, duration: film.duration };
    const existing = await prisma.content.findFirst({ where: { type: "FILM", title: film.title } });
    const data = { title: film.title, description: film.description, type: "FILM", researcherName: "Equipe LACE", externalUrl, metadata, published: true, createdById: importer.id };
    if (existing) await prisma.content.update({ where: { id: existing.id }, data });
    else await prisma.content.create({ data });
  }
  console.log(`${films.length} filme da letra E importado.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
