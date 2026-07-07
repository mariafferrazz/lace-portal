import { CalendarDays, MapPin } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";

export default function MostraVIII() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Cinema e Ditadura · 2026</p>
        <h1 className="mt-4 max-w-4xl font-title text-5xl leading-tight md:text-7xl">VIII Mostra Cinema e Ditadura</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">Uma programação pública do LACE-UFF dedicada à memória da ditadura empresarial-militar brasileira por meio do cinema e do debate acadêmico e comunitário.</p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-zinc-800 bg-card p-6"><CalendarDays className="text-primary" /><h2 className="mt-4 text-xl font-semibold">Sessão 3</h2><p className="mt-2 text-muted">16 de maio de 2026, das 19h às 22h.</p></article>
          <article className="rounded-2xl border border-zinc-800 bg-card p-6"><MapPin className="text-primary" /><h2 className="mt-4 text-xl font-semibold">Casa dos Saberes</h2><p className="mt-2 text-muted">Praça de São Pedro, Nova Friburgo.</p></article>
          <article className="rounded-2xl border border-zinc-800 bg-card p-6"><FaYoutube className="text-primary" aria-hidden="true" /><h2 className="mt-4 text-xl font-semibold">Transmissão online</h2><p className="mt-2 text-muted">Acompanhe também pelo canal do LACE.</p></article>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button as="a" href="https://www.youtube.com/@lacecotidianoexperiencia" target="_blank" rel="noreferrer">Canal do LACE</Button>
          <Button as="a" href="https://www.extensao.uff.br/inscricao/?idcurso=8027" target="_blank" rel="noreferrer" variant="outline">Informações na UFF</Button>
        </div>
      </Container>
    </section>
  );
}
