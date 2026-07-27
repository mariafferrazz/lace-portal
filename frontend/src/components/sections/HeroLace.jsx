import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";

export default function HeroLace({ onOpenAbout }) {
  return (
    <section className="relative overflow-hidden bg-background py-16 lg:py-24">
      <Container>
        <div className="relative flex flex-col items-center">
          <div className="relative w-full max-w-5xl">
            <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-black shadow-[0_16px_44px_rgba(0,0,0,0.35)]">
              <img
                src="/lace-home.png"
                alt="LACE — Laboratório de Agenciamentos Cotidianos e Experiências"
                width="1983"
                height="793"
                className="h-auto w-full object-contain"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>

          <div className="mt-14 max-w-4xl text-center">
            <h1 className="font-title text-5xl leading-tight sm:text-6xl lg:text-7xl">
              Laboratório de Agenciamentos Cotidianos e Experiências
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-muted">
              O LACE conecta universidade, memória e movimentos sociais por meio da pesquisa, da produção audiovisual e da defesa dos direitos humanos.
            </p>
            <div className="mt-14 flex flex-wrap justify-center gap-4">
              <Button type="button" variant="outline" onClick={onOpenAbout}>Conheça o laboratório</Button>
              <Button as={Link} to="/producao-academica/pesquisas" variant="outline">Pesquisas</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
