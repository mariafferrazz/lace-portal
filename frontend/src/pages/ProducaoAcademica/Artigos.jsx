import { ExternalLink } from "lucide-react";
import Container from "../../components/ui/Container";

const authors = [
  {
    name: "Joana D'Arc Fernandes Ferraz",
    href: null,
  },
  {
    name: "Cecilia Maria Bouças Coimbra",
    href: "https://lab-lace.webnode.page/cecilia-maria-boucas-coimbra/",
  },
  {
    name: "Ana Cláudia Camuri",
    href: "https://lab-lace.webnode.page/ana-claudia-camuri/",
  },
  {
    name: "Aline Ribeiro Nascimento",
    href: "https://lab-lace.webnode.page/aline-ribeiro-nascimento/",
  },
  {
    name: "Flávia Mendes Ferreira",
    href: "https://lab-lace.webnode.page/flavia-mendes-ferreira/",
  },
  {
    name: "Carlos Contente",
    href: "https://lab-lace.webnode.page/carlos-contente/",
  },
];

export default function Artigos() {
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
          {authors.map((author) => {
            const content = (
              <>
                <span>{author.name}</span>
                {author.href && <ExternalLink size={18} aria-hidden="true" />}
              </>
            );

            const className =
              "inline-flex min-h-20 w-full items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 text-left font-semibold text-text transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

            return author.href ? (
              <a key={author.name} className={className} href={author.href} target="_blank" rel="noreferrer">
                {content}
              </a>
            ) : (
              <button key={author.name} className={className} type="button">
                {content}
              </button>
            );
          })}
        </section>
      </Container>
    </main>
  );
}
