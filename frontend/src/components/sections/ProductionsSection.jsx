import { BookOpen, Headphones, Video } from "lucide-react";
import ResearchCard from "../cards/ResearchCard";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const productions = [
  { title: "Produção acadêmica", summary: "Artigos, pesquisas, traduções e a série Linhas de Fugas Virais.", to: "/producao-academica/artigos", icon: BookOpen },
  { title: "Podcasts", summary: "Memórias, testemunhos e histórias de resistência em formato sonoro.", to: "/producao-audiovisual/podcasts", icon: Headphones },
  { title: "Cinema e Ditadura", summary: "Filmes, documentários e verbetes para pensar criticamente a história recente.", to: "/cinema-e-ditadura/filmes", icon: Video },
];

export default function ProductionsSection() {
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <SectionTitle subtitle="Acervo" title="Produções do LACE" />
        <div className="grid gap-6 md:grid-cols-3">
          {productions.map((production) => (
            <ResearchCard
              key={production.title}
              {...production}
              category="Produção do LACE"
              actionLabel="Explorar"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
