import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import EventCard from "../cards/EventCard";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const highlights = [
  {
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000169-804c1804c2/13ad51a8-369d-446e-9987-d0ae30dd2fe7.webp?ph=3554c7d1fd",
    imageAlt: "VII Mostra Cinema e Ditadura",
    year: "2025",
    title: "VII MOSTRA CINEMA E DITADURA",
    description:
      "Sétima edição da mostra promovida pelo LACE para pensar a ditadura brasileira por meio do cinema e do debate público.",
    to: "/cinema-e-ditadura/vii-mostra",
  },
  {
    image: "https://i4.ytimg.com/vi/3y6GG61RCpg/hqdefault.jpg",
    imageAlt: "VI Mostra Cinema e Ditadura",
    year: "2024",
    title: "VI MOSTRA CINEMA E DITADURA",
    description:
      "Sessões, debates e materiais audiovisuais voltados à memória social, aos movimentos de resistência e aos direitos humanos.",
    to: "/cinema-e-ditadura/vi-mostra",
  },
  {
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000163-741a2741a3/Chamada%20para%20verbetes%20%281%29.webp?ph=3554c7d1fd",
    imageAlt: "Chamada para produção de verbetes",
    year: "2024",
    title: "CHAMADA PARA PRODUÇÃO DE VERBETES",
    description:
      "Chamada do LACE para produção de verbetes sobre temas relacionados à Ditadura Empresarial Militar.",
    to: "/eventos/2024",
  },
  {
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000155-19b7519b78/700/404275078_920886799556176_2318967520888483703_n.webp?ph=3554c7d1fd",
    imageAlt: "Seminário Empresas e Empresários na Ditadura",
    year: "2023",
    title: "SEMINÁRIO EMPRESAS E EMPRESÁRIOS NA DITADURA",
    description:
      "Agenda de pesquisas comum realizada na Universidade Federal Fluminense, no Campus Gragoatá, em Niterói.",
    to: "/eventos/2023",
  },
  {
    image: "https://i.ytimg.com/vi/dsOuU9aKEl8/hqdefault.jpg",
    imageAlt: "V Mostra Cinema e Ditadura",
    year: "2023",
    title: "V MOSTRA CINEMA E DITADURA",
    description:
      "Mostra dedicada a filmes e debates sobre memória, gênero, raça, repressão e resistência durante a ditadura empresarial-militar.",
    to: "/cinema-e-ditadura/v-mostra",
  },
  {
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000159-cdc6ccdc6e/700/Podcasting.webp?ph=3554c7d1fd",
    imageAlt: "No Convés da Repressão e Resistência - O podcast do LACE",
    year: "2022",
    title: "NO CONVÉS DA REPRESSÃO E RESISTÊNCIA",
    description:
      "Podcast do LACE dedicado à memória, à repressão e à resistência dos operários navais durante a ditadura empresarial-militar.",
    to: "/producao-audiovisual/podcasts",
  },
  {
    image: "https://i.ytimg.com/vi/iuRlQ17bDbM/hqdefault.jpg",
    imageAlt: "IV Mostra Cinema e Ditadura",
    year: "2022",
    title: "IV MOSTRA CINEMA E DITADURA",
    description:
      "Programação dedicada a filmes, debates e reflexões sobre memória, violência de Estado e direitos humanos.",
    to: "/cinema-e-ditadura/iv-mostra",
  },
  {
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000026-7a51b7a51d/Evento%20III%20Cine%201.jpg?ph=3554c7d1fd",
    imageAlt: "III Mostra Virtual Cinema e Ditadura",
    year: "2021",
    title: "III MOSTRA VIRTUAL CINEMA E DITADURA",
    description:
      "Mostra virtual com debates e reflexões sobre temas historicamente ligados à ditadura militar brasileira.",
    to: "/cinema-e-ditadura/iii-mostra",
  },
];

export default function FeaturedEventSection() {
  const carouselRef = useRef(null);

  function scrollCarousel(direction) {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.querySelector("[data-carousel-card]");
    const cardWidth = firstCard?.getBoundingClientRect().width || carousel.clientWidth;
    carousel.scrollBy({
      left: direction === "next" ? cardWidth + 24 : -(cardWidth + 24),
      behavior: "smooth",
    });
  }

  return (
    <section className="bg-background py-24 lg:py-32">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle subtitle="Destaques" title="Últimos eventos" />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scrollCarousel("previous")}
              className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-card text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Ver eventos anteriores"
            >
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel("next")}
              className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-card text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Ver próximos eventos"
            >
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Últimos quatro eventos em destaque"
        >
          {highlights.map((event) => (
            <div
              key={event.title}
              data-carousel-card
              className="w-[82vw] max-w-[420px] shrink-0 snap-start sm:w-[44vw] lg:w-[31%] xl:w-[24%]"
            >
              <EventCard {...event} actionLabel="Conhecer evento" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
