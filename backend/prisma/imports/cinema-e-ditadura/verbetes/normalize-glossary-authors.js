require("dotenv").config();
const prisma = require("../../../../src/db");

const bios = {
  "AI-5": "Graduanda em Sociologia pela Universidade Federal Fluminense (UFF).",
  "Argentina": "Graduando em Sociologia pela Universidade Federal Fluminense, integrante da linha de pesquisa “Cinema e ditadura em plataforma virtual”, vinculada ao grupo de pesquisa certificado no CNPq “Subjetividade, Memória e Violência do Estado”. Bolsista de Iniciação Científica/UFF.",
  "Arte na Ditadura": "Graduando em Sociologia pela Universidade Federal Fluminense, integrante da Linha de Pesquisa “Cinema e Ditadura em Plataforma Virtual”, ligado ao grupo de pesquisa certificado no CNPq “Subjetividade, Memória e Violência do Estado”.",
  "Censura": "Graduanda em Sociologia pela Universidade Federal Fluminense (UFF), integrante da linha de pesquisa “Cinema e ditadura em plataforma virtual”, vinculada ao grupo de pesquisa certificado no CNPq “Subjetividade, Memória e Violência do Estado”. Bolsista de Iniciação Tecnológica da FAPERJ.",
  "Censura e Cinema": "Estudante de Cinema e Audiovisual na Universidade Federal do Recôncavo da Bahia, integrante da Linha de Pesquisa “Cinema e Ditadura em Plataforma Virtual”.",
  "Comissão Nacional da Verdade": "Graduanda em Sociologia pela Universidade Federal Fluminense e integrante da linha de pesquisa “Cinema e ditadura em plataforma virtual”.",
  "Comunismo": "Graduanda em Ciências Sociais pela Universidade Federal Fluminense e integrante da Linha de Pesquisa “Cinema e Ditadura em Plataforma Virtual”. Bolsista de Desenvolvimento Acadêmico da UFF.",
  "Crianças na Ditadura": "Graduanda em Sociologia pela Universidade Federal Fluminense, pesquisadora e integrante da linha de pesquisa “Cinema e ditadura em plataforma virtual”.",
};

const withoutBio = new Set(["Arte na Ditadura", "Censura", "Comunismo"]);

async function main() {
  for (const [title, authorBio] of Object.entries(bios)) {
    const entry = await prisma.content.findFirst({ where: { type: "GLOSSARY", title } });
    if (!entry) continue;
    const metadata = entry.metadata || {};
    let references = metadata.references;
    if (withoutBio.has(title)) references = null;
    else if (title === "AI-5") references = references?.split("\n\nDanusa Ester")[0];
    else if (title === "Argentina") references = references?.split("\n\nGabriel Mamede")[0];
    else if (title === "Censura e Cinema") references = references?.split("\n\nMaria Clara Arbex")[0];
    else if (title === "Comissão Nacional da Verdade") references = references?.split("\n\nAna Cláudia Bessa")[0];
    else if (title === "Crianças na Ditadura") references = references?.split("\n\nAna Cláudia Bessa")[0];
    await prisma.content.update({ where: { id: entry.id }, data: { metadata: { ...metadata, authorBio, references } } });
  }
  console.log("Autoria e referências separadas.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
