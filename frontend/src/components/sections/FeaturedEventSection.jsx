import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import EventCard from "../cards/EventCard";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import api from "../../services/api";
import { contentFileUrls, contentImage } from "../../utils/contentMetadata";
import { contentEventPath, eventYear, showPath } from "../../utils/contentRoutes";

const fallbackImage = "https://i.ytimg.com/vi/iuRlQ17bDbM/hqdefault.jpg";

const fallbackHighlights = [
  {
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000169-804c1804c2/13ad51a8-369d-446e-9987-d0ae30dd2fe7.webp?ph=3554c7d1fd",
    imageAlt: "VII Mostra Cinema e Ditadura",
    year: "2025",
    title: "VII MOSTRA CINEMA E DITADURA",
    description:
      "Setima edicao da mostra promovida pelo LACE para pensar a ditadura brasileira por meio do cinema e do debate publico.",
    to: "/cinema-e-ditadura/vii-mostra",
  },
  {
    image: "https://i4.ytimg.com/vi/3y6GG61RCpg/hqdefault.jpg",
    imageAlt: "VI Mostra Cinema e Ditadura",
    year: "2024",
    title: "VI MOSTRA CINEMA E DITADURA",
    description:
      "Sessoes, debates e materiais audiovisuais voltados a memoria social, aos movimentos de resistencia e aos direitos humanos.",
    to: "/cinema-e-ditadura/vi-mostra",
  },
  {
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000163-741a2741a3/Chamada%20para%20verbetes%20%281%29.webp?ph=3554c7d1fd",
    imageAlt: "Chamada para producao de verbetes",
    year: "2024",
    title: "CHAMADA PARA PRODUCAO DE VERBETES",
    description:
      "Chamada do LACE para producao de verbetes sobre temas relacionados a Ditadura Empresarial Militar.",
    to: "/eventos/2024",
  },
  {
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000155-19b7519b78/700/404275078_920886799556176_2318967520888483703_n.webp?ph=3554c7d1fd",
    imageAlt: "Seminario Empresas e Empresarios na Ditadura",
    year: "2023",
    title: "SEMINARIO EMPRESAS E EMPRESARIOS NA DITADURA",
    description:
      "Agenda de pesquisas comum realizada na Universidade Federal Fluminense, no Campus Gragoata, em Niteroi.",
    to: "/eventos/2023",
  },
  {
    image: "https://i.ytimg.com/vi/dsOuU9aKEl8/hqdefault.jpg",
    imageAlt: "V Mostra Cinema e Ditadura",
    year: "2023",
    title: "V MOSTRA CINEMA E DITADURA",
    description:
      "Mostra dedicada a filmes e debates sobre memoria, genero, raca, repressao e resistencia durante a ditadura empresarial-militar.",
    to: "/cinema-e-ditadura/v-mostra",
  },
  {
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000159-cdc6ccdc6e/700/Podcasting.webp?ph=3554c7d1fd",
    imageAlt: "No Conves da Repressao e Resistencia - O podcast do LACE",
    year: "2022",
    title: "NO CONVES DA REPRESSAO E RESISTENCIA",
    description:
      "Podcast do LACE dedicado a memoria, a repressao e a resistencia dos operarios navais durante a ditadura empresarial-militar.",
    to: "/producao-audiovisual/podcasts",
  },
  {
    image: "https://i.ytimg.com/vi/iuRlQ17bDbM/hqdefault.jpg",
    imageAlt: "IV Mostra Cinema e Ditadura",
    year: "2022",
    title: "IV MOSTRA CINEMA E DITADURA",
    description:
      "Programacao dedicada a filmes, debates e reflexoes sobre memoria, violencia de Estado e direitos humanos.",
    to: "/cinema-e-ditadura/iv-mostra",
  },
  {
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000026-7a51b7a51d/Evento%20III%20Cine%201.jpg?ph=3554c7d1fd",
    imageAlt: "III Mostra Virtual Cinema e Ditadura",
    year: "2021",
    title: "III MOSTRA VIRTUAL CINEMA E DITADURA",
    description:
      "Mostra virtual com debates e reflexoes sobre temas historicamente ligados a ditadura militar brasileira.",
    to: "/cinema-e-ditadura/iii-mostra",
  },
];

function eventPath(content) {
  if (content.type === "CINEMA_SHOW") return showPath(content);
  return contentEventPath(content) || contentFileUrls(content)[0] || "/";
}

function eventCardFromContent(content) {
  return {
    image: contentImage(content, fallbackImage),
    imageAlt: content.title,
    year: eventYear(content),
    title: content.title,
    description: content.description || "Conteudo publicado pelo LACE em eventos e atividades.",
    to: eventPath(content),
    dynamicId: content.id,
    createdAt: content.createdAt,
  };
}

function eventYearValue(event) {
  const year = Number(event.year || 0);
  return Number.isFinite(year) ? year : 0;
}

function sortHighlightsNewestFirst(events) {
  return events.sort((left, right) => {
    const yearDifference = eventYearValue(right) - eventYearValue(left);
    if (yearDifference !== 0) return yearDifference;
    const dateDifference = new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
    return dateDifference || left.sourceOrder - right.sourceOrder;
  });
}

export default function FeaturedEventSection() {
  const carouselRef = useRef(null);
  const carouselPausedRef = useRef(false);
  const [dynamicHighlights, setDynamicHighlights] = useState([]);
  const events = useMemo(() => {
    const seen = new Set();
    const combinedHighlights = [...dynamicHighlights.map(eventCardFromContent), ...fallbackHighlights]
      .map((event, sourceOrder) => ({ ...event, sourceOrder }))
      .filter((event) => event.to && event.title)
      .filter((event) => {
        const key = `${event.title}-${event.year}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    return sortHighlightsNewestFirst(combinedHighlights).slice(0, 8);
  }, [dynamicHighlights]);
  const loopEvents = useMemo(
    () => (events.length > 1 ? [...events, ...events] : events),
    [events],
  );

  useEffect(() => {
    let active = true;
    api
      .get("/contents/highlights")
      .then(({ data }) => {
        if (active) setDynamicHighlights(data.contents || []);
      })
      .catch(() => {
        if (active) setDynamicHighlights([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const cycleWidth = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel || events.length < 2) return 0;

    const cards = carousel.querySelectorAll("[data-carousel-card]");
    return cards[events.length]?.offsetLeft - cards[0]?.offsetLeft || 0;
  }, [events.length]);

  const normalizeCarouselPosition = useCallback(() => {
    const carousel = carouselRef.current;
    const width = cycleWidth();
    if (!carousel || !width) return;

    if (carousel.scrollLeft >= width - 1) carousel.scrollLeft -= width;
  }, [cycleWidth]);

  const scrollCarousel = useCallback((direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.querySelector("[data-carousel-card]");
    const cardWidth = firstCard?.getBoundingClientRect().width || carousel.clientWidth;
    const width = cycleWidth();

    if (direction === "previous" && width && carousel.scrollLeft <= 1) {
      carousel.scrollLeft = width;
    } else {
      normalizeCarouselPosition();
    }

    carousel.scrollBy({
      left: direction === "next" ? cardWidth + 24 : -(cardWidth + 24),
      behavior: "smooth",
    });
  }, [cycleWidth, normalizeCarouselPosition]);

  useEffect(() => {
    if (events.length < 2) return undefined;
    const intervalId = window.setInterval(() => {
      if (!carouselPausedRef.current) scrollCarousel("next");
    }, 5500);

    return () => window.clearInterval(intervalId);
  }, [events.length, scrollCarousel]);

  return (
    <section className="bg-background py-24 lg:py-32">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle subtitle="Destaques" title="Ultimos eventos" />
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
              aria-label="Ver proximos eventos"
            >
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          onScroll={normalizeCarouselPosition}
          onMouseEnter={() => { carouselPausedRef.current = true; }}
          onMouseLeave={() => { carouselPausedRef.current = false; }}
          onFocusCapture={() => { carouselPausedRef.current = true; }}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) carouselPausedRef.current = false;
          }}
          className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Ultimos eventos em destaque"
        >
          {loopEvents.map((event, index) => {
            const duplicate = index >= events.length;
            return (
            <div
              key={`${event.dynamicId || event.title}-${duplicate ? "loop" : "original"}`}
              data-carousel-card
              aria-hidden={duplicate || undefined}
              inert={duplicate || undefined}
              className="w-[82vw] max-w-[420px] shrink-0 snap-start sm:w-[44vw] lg:w-[31%] xl:w-[24%]"
            >
              <EventCard {...event} actionLabel="Conhecer evento" />
            </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
