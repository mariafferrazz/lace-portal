require("dotenv").config();
const prisma = require("../../../../src/db");

const entries = [{
  title: "Desaparecidos",
  researcherName: "Victor Hugo de Arruda Aranha Barbosa",
  authorBio: "Graduando em Sociologia pela Universidade Federal Fluminense, colaborador da Linha de Pesquisa “Cinema e Ditadura em Plataforma Virtual”, ligado ao grupo de pesquisa certificado no CNPq “Subjetividade, Memória e Violência do Estado”.",
  relatedTitles: ["Pra Frente, Brasil"],
  inlineImages: [{ afterText: "tais crimes configuram-se como ‘crimes continuados’.”", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000130-2bfcc2bfcf/450/dpo.webp?ph=3554c7d1fd", alt: "Familiares de desaparecidos políticos na porta do DEOPS", caption: "Familiares na porta do DEOPS · Fonte: Comissão da Verdade da PUC-SP" }],
  description: `Desde o início do desaparecimento de pessoas durante a ditadura empresarial militar brasileira (1964-1985), lacunas continuam sendo deixadas em aberto. Conforme definido pela Comissão da Verdade da PUC-SP, o termo desaparecido político é empregado “para qualificar o militante que teve participação política nas organizações de oposição à ditadura civil-militar e seu paradeiro é desconhecido, as circunstâncias do sequestro e assassinato nunca foram esclarecidas e seus restos mortais não foram localizados; por essa razão, tais crimes configuram-se como ‘crimes continuados’.”

Uma das lacunas deixadas na história é a negligência em relação à situação dos desaparecidos políticos tratada na Lei de Anistia. Durante o II Congresso da Anistia, em 1979, foi apresentada a primeira sistematização sobre assassinatos e desaparecimentos. No entanto, este tema saiu da pauta, o que levou à criação da Comissão de Familiares de Mortos e Desaparecidos Políticos, em 1990. Em 1995, foi sancionada a Lei dos Desaparecidos Políticos (nº 9.140), que reconhece os desaparecidos — em seu anexo há 136 casos apurados a partir da investigação dos próprios familiares — e foi criada a Comissão Especial sobre Mortos e Desaparecidos.

No entanto, esta lei é limitada, pois o ônus da prova recai sobre o familiar, e o Estado não se mobiliza para a busca dos corpos, oferecendo apenas o atestado de óbito e a indenização aos familiares. Além disso, o Estado até o momento não se responsabilizou pelos crimes cometidos.

A partir dos trabalhos da Comissão Especial sobre Mortos e Desaparecidos Políticos (CEMDP), foi lançado, em 2007, o livro “Direito à Memória e à Verdade: Comissão Especial sobre Mortos e Desaparecidos Políticos”, que contém onze trabalhos da CEMDP utilizados como o primeiro relatório brasileiro sobre o tema.`,
  references: "COMISSÃO DA VERDADE DA PUC-SP. Mortos e Desaparecidos. Disponível em: https://www.pucsp.br/comissaodaverdade/mortos-e-desaparecidos-contextualizacao. Acesso em: 06/10/2019.\n\nBRASIL. Direito à Memória e à Verdade: Comissão Especial sobre Mortos e Desaparecidos Políticos. 2007.",
}];

async function main() {
  const importer = await prisma.user.findUnique({ where: { email: "importacao-acervo@lace.local" } });
  const films = await prisma.content.findMany({ where: { type: "FILM", published: true }, select: { id: true, title: true } });
  for (const entry of entries) {
    const relatedFilms = entry.relatedTitles.map((title) => films.find((film) => film.title === title)).filter(Boolean);
    const metadata = { authorBio: entry.authorBio, references: entry.references, relatedFilms, inlineImages: entry.inlineImages };
    const existing = await prisma.content.findFirst({ where: { type: "GLOSSARY", title: entry.title } });
    const data = { title: entry.title, description: entry.description, type: "GLOSSARY", researcherName: entry.researcherName, metadata, published: true, createdById: importer.id };
    if (existing) await prisma.content.update({ where: { id: existing.id }, data }); else await prisma.content.create({ data });
  }
  console.log("Verbete Desaparecidos importado.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
