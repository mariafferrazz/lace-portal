import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, ExternalLink, Images, X } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";

const events = [
  {
    title: "No Convés da Repressão e Resistência - O podcast do LACE",
    period: "2022",
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000159-cdc6ccdc6e/700/Podcasting.webp?ph=3554c7d1fd",
    description:
      "O podcast do LACE reúne episódios dedicados à memória, à repressão e à resistência dos operários navais durante a ditadura empresarial-militar brasileira.",
    links: [
      {
        label: "Abrir podcast",
        to: "/producao-audiovisual/podcasts",
      },
    ],
  },
  {
    title: "IV Mostra Cinema e Ditadura",
    period: "2022",
    image: "https://i.ytimg.com/vi/iuRlQ17bDbM/hqdefault.jpg",
    description:
      "A IV Mostra Cinema e Ditadura integra a programação do LACE dedicada a filmes, debates e reflexões sobre memória, violência de Estado e direitos humanos.",
    links: [
      {
        label: "Abrir IV Mostra",
        to: "/cinema-e-ditadura/iv-mostra",
      },
    ],
  },
];

export default function Eventos2022() {
  const [activeEvent, setActiveEvent] = useState(null);
  const activeEventIndex = useMemo(
    () => events.findIndex((event) => event.title === activeEvent?.title),
    [activeEvent],
  );

  const navigateEvent = useCallback((direction) => {
    if (!activeEvent) return;

    const nextIndex =
      direction === "previous"
        ? (activeEventIndex - 1 + events.length) % events.length
        : (activeEventIndex + 1) % events.length;

    setActiveEvent(events[nextIndex]);
  }, [activeEvent, activeEventIndex]);

  useEffect(() => {
    if (!activeEvent) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") setActiveEvent(null);
      if (event.key === "ArrowLeft") navigateEvent("previous");
      if (event.key === "ArrowRight") navigateEvent("next");
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeEvent, navigateEvent]);

  return (
    <main className="bg-background py-20 lg:py-28">
      <Container>
        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Eventos e atividades</p>
          <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">Eventos 2022</h1>
        </header>

        <section className="mt-12 grid gap-6 md:grid-cols-2" aria-label="Eventos 2022">
          {events.map((event) => (
            <button
              key={event.title}
              type="button"
              className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card text-left text-text transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setActiveEvent(event)}
            >
              <img className="aspect-[4/3] w-full object-cover" src={event.image} alt="" loading="lazy" decoding="async" />
              <span className="flex flex-1 flex-col p-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">{event.period}</span>
                <span className="mt-3 block font-title text-3xl">{event.title}</span>
                <span className="mt-4 flex-1 leading-7 text-muted">{event.description}</span>
                <span className="mt-6 inline-flex items-center gap-2 self-start font-semibold text-primary">
                  <span className="animated-underline">Ver detalhes</span>
                  <Images size={16} aria-hidden="true" />
                </span>
              </span>
            </button>
          ))}
        </section>
      </Container>

      {activeEvent && (
        <EventModal
          event={activeEvent}
          onClose={() => setActiveEvent(null)}
          onNavigate={navigateEvent}
        />
      )}
    </main>
  );
}

function EventModal({ event, onClose, onNavigate }) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      onMouseDown={(clickEvent) => {
        if (clickEvent.target === clickEvent.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-white/20 bg-background p-5 shadow-2xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-black/70 p-3 text-white transition hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          aria-label="Fechar evento"
        >
          <X size={24} aria-hidden="true" />
        </button>

        <div className="flex flex-wrap gap-3 pr-14">
          <button
            type="button"
            onClick={() => onNavigate("previous")}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary"
          >
            <ArrowLeft size={18} aria-hidden="true" /> Evento anterior
          </button>
          <button
            type="button"
            onClick={() => onNavigate("next")}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary"
          >
            Próximo evento <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>

        <section className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <img
            className="max-h-[620px] w-full rounded-2xl border border-border object-contain"
            src={event.image}
            alt={event.title}
            decoding="async"
          />

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">{event.period}</p>
            <h2 id="event-modal-title" className="mt-3 pr-10 font-title text-4xl md:text-5xl">
              {event.title}
            </h2>
            <p className="mt-5 leading-8 text-muted">{event.description}</p>

            {event.links?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {event.links.map((link) => (
                  <Link
                    key={link.to}
                    className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary"
                    to={link.to}
                    onClick={onClose}
                  >
                    {link.label} <ExternalLink size={16} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>,
    document.body,
  );
}
