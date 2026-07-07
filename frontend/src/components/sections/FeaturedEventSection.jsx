import EventCard from "../cards/EventCard";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const highlights = [
  {
    image: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000171-d675ad675c/WhatsApp%20Image%202025-10-19%20at%2007.07.45.webp?ph=3554c7d1fd",
    imageAlt: "LAB LACE na Semana Acadêmica 2025 — Cinema e Ditadura",
    year: "21/10/2025 · Semana Acadêmica",
    title: "LAB LACE NA SEMANA ACADÊMICA 2025 — CINEMA E DITADURA",
    description: "Atividade do LAB LACE dedicada às relações entre cinema, memória e ditadura durante a Semana Acadêmica de 2025.",
    to: "/eventos/semana-academica-2025",
  },
  {
    image: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000169-804c1804c2/13ad51a8-369d-446e-9987-d0ae30dd2fe7.webp?ph=3554c7d1fd",
    imageAlt: "VII Mostra Cinema e Ditadura",
    year: "17/09/2025 · 7ª edição",
    title: "VII MOSTRA CINEMA E DITADURA",
    description: "Sétima edição da mostra promovida pelo LACE para pensar a ditadura brasileira por meio do cinema e do debate público.",
    to: "/cinema-e-ditadura/vii-mostra",
  },
];

export default function FeaturedEventSection() {
  return (
    <section className="bg-background py-24 lg:py-32">
      <Container>
        <SectionTitle subtitle="Destaques" title="Últimos eventos" />
        <div className="grid gap-6 lg:grid-cols-2">
          {highlights.map((event) => (
            <EventCard key={event.title} {...event} actionLabel="Conhecer evento" />
          ))}
        </div>
      </Container>
    </section>
  );
}
