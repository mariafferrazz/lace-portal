import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import EventCard from "../cards/EventCard";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import api from "../../services/api";
import { contentFileUrls, contentImage } from "../../utils/contentMetadata";
import { contentEventPath, eventYear, showPath } from "../../utils/contentRoutes";

function eventPath(content) {
  if (content.type === "CINEMA_SHOW") return showPath(content);
  return contentEventPath(content) || contentFileUrls(content)[0] || "/";
}

function eventCardFromContent(content) {
  return {
    image: contentImage(content, ""),
    imageAlt: content.title,
    year: eventYear(content),
    title: content.title,
    description: content.description || "",
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
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const carouselPausedRef = useRef(false);
  const carouselCycleWidthRef = useRef(0);
  const scrollFrameRef = useRef(null);
  const [dynamicHighlights, setDynamicHighlights] = useState([]);
  const [loadState, setLoadState] = useState("loading");
  const [carouselActive, setCarouselActive] = useState(false);
  const events = useMemo(() => {
    const seen = new Set();
    const dashboardHighlights = dynamicHighlights
      .map(eventCardFromContent)
      .map((event, sourceOrder) => ({ ...event, sourceOrder }))
      .filter((event) => event.to && event.title)
      .filter((event) => {
        const key = `${event.title}-${event.year}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    return sortHighlightsNewestFirst(dashboardHighlights).slice(0, 8);
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
        if (active) {
          setDynamicHighlights(data.contents || []);
          setLoadState("ready");
        }
      })
      .catch(() => {
        if (active) {
          setDynamicHighlights([]);
          setLoadState("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const measureCycleWidth = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel || events.length < 2) {
      carouselCycleWidthRef.current = 0;
      return;
    }

    const cards = carousel.querySelectorAll("[data-carousel-card]");
    carouselCycleWidthRef.current = cards[events.length]?.offsetLeft - cards[0]?.offsetLeft || 0;
  }, [events.length]);

  useLayoutEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return undefined;

    carousel.scrollLeft = 0;
    measureCycleWidth();

    if (!("ResizeObserver" in window)) {
      window.addEventListener("resize", measureCycleWidth);
      return () => window.removeEventListener("resize", measureCycleWidth);
    }

    const resizeObserver = new ResizeObserver(measureCycleWidth);
    resizeObserver.observe(carousel);
    return () => resizeObserver.disconnect();
  }, [events, measureCycleWidth]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    if (!("IntersectionObserver" in window)) {
      const fallbackId = window.setTimeout(() => setCarouselActive(true), 0);
      return () => window.clearTimeout(fallbackId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setCarouselActive(entry.isIntersecting),
      {
        rootMargin: "0px 0px -33% 0px",
        threshold: 0,
      },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const cycleWidth = useCallback(() => {
    if (events.length < 2) return 0;
    if (!carouselCycleWidthRef.current) measureCycleWidth();
    return carouselCycleWidthRef.current;
  }, [events.length, measureCycleWidth]);

  const normalizeCarouselPosition = useCallback(() => {
    const carousel = carouselRef.current;
    const width = cycleWidth();
    if (!carousel || !width) return;

    if (carousel.scrollLeft >= width - 1) carousel.scrollLeft -= width;
  }, [cycleWidth]);

  const handleCarouselScroll = useCallback(() => {
    if (scrollFrameRef.current) return;

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      normalizeCarouselPosition();
    });
  }, [normalizeCarouselPosition]);

  useEffect(() => () => {
    if (scrollFrameRef.current) window.cancelAnimationFrame(scrollFrameRef.current);
  }, []);

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
    if (!carouselActive || events.length < 2) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const intervalId = window.setInterval(() => {
      if (!carouselPausedRef.current) scrollCarousel("next");
    }, 8000);

    return () => window.clearInterval(intervalId);
  }, [carouselActive, events.length, scrollCarousel]);

  const emptyMessage = loadState === "loading"
    ? "Carregando os últimos eventos publicados..."
    : loadState === "error"
      ? "Não foi possível carregar os eventos agora."
      : "Nenhum evento foi publicado pelo dashboard ainda.";

  return (
    <section ref={sectionRef} className="bg-background py-24 lg:py-32">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle subtitle="Destaques" title="Últimos eventos" />
          {events.length > 1 && (
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
          )}
        </div>

        {events.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-border bg-card p-6 text-muted" role="status">
            {emptyMessage}
          </p>
        ) : (
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            onMouseEnter={() => { carouselPausedRef.current = true; }}
            onMouseLeave={() => { carouselPausedRef.current = false; }}
            onFocusCapture={() => { carouselPausedRef.current = true; }}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) carouselPausedRef.current = false;
            }}
            className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Últimos eventos em destaque"
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
        )}
      </Container>
    </section>
  );
}
