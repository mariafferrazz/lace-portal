import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, FileText, X } from "lucide-react";
import Container from "../../components/ui/Container";

const authors = [
  {
    name: "Joana D'Arc Fernandes Ferraz",
    articles: [
      {
        title: "O Dia Que Durou 21 Anos: a simbiose entre passado e o presente pelas lentes do cinema",
        url: "https://www.e-publicacoes.uerj.br/index.php/transversos/article/view/26535",
        summary:
          "O objetivo geral deste artigo é refletir, com Nietzsche e Foucault, sobre o uso que fazemos da História do golpe militar-empresarial brasileiro, por meio do documentário O DIA QUE DUROU 21 ANOS (Brasil, 2013) e de autores que, ainda na ditadura, nas décadas de 1970 e de 1980 do século passado, interpretaram este evento a partir do contexto político e econômico de dependência ao capital internacional. A démarche a estes autores brasileiros tem como foco analisar questões que, pelas mais variadas percepções, acabaram se empoeirando e se distanciando de nossos olhares.",
      },
      {
        title: "A Pandorga e a Lei: passado-presente-futuro",
        url: "https://www.e-publicacoes.uerj.br/index.php/maracanan/article/view/31248",
        summary:
          "Percorrendo os diferentes tempos provocados pela peça A Pandorga e a Lei (1983-1984), de João das Neves, este artigo pretende pensar as relações entre memória e crise no Brasil contemporâneo, a partir do conceito de duração e dos seus desdobramentos, inaugurado por Henri Bergson. Foi feita a leitura pública desta peça, pela primeira vez, no I Seminário do Grupo Tortura Nunca Mais - RJ, ocorrido nos dias 28, 29, 30, 31 outubro e 1º de novembro de 1985, na Universidade Cândido Mendes. Este Seminário formalizou a fundação do GTNM-RJ. Nossas reflexões têm como ponto de partida a ditadura empresarial-militar brasileira. Mais do que um tempo linear, cronológico e quantitativo, o tempo da duração é múltiplo e qualitativo. Nele, passado, presente e futuro interagem incessantemente, suscitam problemas, reativam feridas, cicatrizes e abrem brechas. Atravessar as fronteiras do tempo, olhar para os horrores do passado, perceber o que tem deste passado no presente e atentar para o que ele pode nos acenar para o futuro impõe-se como desafio à compreensão do panorama contemporâneo brasileiro.",
      },
      {
        title: "Grupo Tortura Nunca Mais do Rio De Janeiro: três décadas de resistência",
        url: "https://www.e-publicacoes.uerj.br/index.php/transversos/issue/view/1782/showToc",
        note: "Dossiê: Marilene Rosa Nogueira, Cecília Maria Bouças Coimbra, Joana D'Arc Fernandes Ferraz",
      },
      {
        title: "Lugares de memória da ditadura: disputas entre o poder público e os movimentos sociais",
        url: "https://revistas.ulusofona.pt/index.php/cadernosociomuseologia/article/view/6367",
        note: "Joana D'Arc Fernandes Ferraz e Lucas Pacheco Campos",
        summary:
          "Os lugares de memória, na perspectiva de Pierre Nora (1990), são espaços de eternização de uma memória de um grupo que já não consegue mais ser evocada espontaneamente pela memória coletiva. Há uma grande disputa entre o Estado e os movimentos sociais em relação à preservação do patrimônio histórico que faz alusão ao golpe militar-empresarial brasileiro (1964-1985), no Rio de Janeiro. Pretendemos pensar o lugar político destes lugares memórias, a partir das querelas em torno da patrimonização de alguns espaços e prédios, que fazem apologia ao golpe e à ditadura, na cidade do Rio de Janeiro. A política que tem sido efetuada até agora pelo Estado pode ser definida como conciliatória. Não obstante, os movimentos sociais reclamam a inserção de suas vozes nestes lugares, considerando-as, silenciadas ou esquecidas. Interessa-nos analisar estas disputas e as seus reflexos na sociedade.",
      },
    ],
  },
  { name: "Cecilia Maria Bouças Coimbra", articles: [] },
  { name: "Ana Cláudia Camuri", articles: [] },
  { name: "Aline Ribeiro Nascimento", articles: [] },
  { name: "Flávia Mendes Ferreira", articles: [] },
  { name: "Carlos Contente", articles: [] },
];

export default function Artigos() {
  const [activeAuthor, setActiveAuthor] = useState(null);

  useEffect(() => {
    if (!activeAuthor) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setActiveAuthor(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeAuthor]);

  return (
    <main className="bg-background py-20 lg:py-28">
      <Container>
        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Produção acadêmica</p>
          <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">Artigos</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Nessa aba você pode conferir as publicações e artigos do nosso núcleo de pesquisa:
          </p>
        </header>

        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Autoras e autores">
          {authors.map((author) => (
            <button
              key={author.name}
              className="inline-flex min-h-20 w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 text-left font-semibold text-text transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              type="button"
              onClick={() => setActiveAuthor(author)}
            >
              <span>{author.name}</span>
              <FileText size={20} className="shrink-0 text-primary" aria-hidden="true" />
            </button>
          ))}
        </section>
      </Container>

      {activeAuthor && <AuthorModal author={activeAuthor} onClose={() => setActiveAuthor(null)} />}
    </main>
  );
}

function AuthorModal({ author, onClose }) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="author-articles-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/20 bg-background p-6 shadow-2xl md:p-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-3 text-white transition hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          aria-label="Fechar artigos"
        >
          <X size={24} aria-hidden="true" />
        </button>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Artigos</p>
        <h2 id="author-articles-title" className="mt-3 pr-12 font-title text-4xl md:text-5xl">
          {author.name}
        </h2>

        {author.articles.length > 0 ? (
          <div className="mt-8 grid gap-5">
            {author.articles.map((article) => (
              <article key={article.title} className="rounded-2xl border border-border bg-card p-5 md:p-6">
                <h3 className="font-title text-3xl text-text">{article.title}</h3>
                {article.note && <p className="mt-3 text-sm font-semibold text-primary">{article.note}</p>}
                {article.summary && <p className="mt-4 leading-7 text-muted">{article.summary}</p>}
                <a
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary"
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Link para PDF <ExternalLink size={16} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/60 p-6">
            <p className="leading-7 text-muted">Os artigos desta autoria serão adicionados em breve.</p>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
