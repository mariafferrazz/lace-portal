import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Images, X } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";

const events = [
  {
    title: "Seminário Empresas e Empresários na Ditadura",
    period: "29 e 30 de novembro de 2023",
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000155-19b7519b78/700/404275078_920886799556176_2318967520888483703_n.webp?ph=3554c7d1fd",
    description:
      "Seminário Empresas e Empresários na Ditadura. Agenda de pesquisas comum, realizado nos dias 29 e 30 de novembro, no Auditório do Bloco P da Universidade Federal Fluminense / UFF - Campus Gragoatá, Niterói, RJ.",
    details: [
      "Dias 29 e 30 de novembro.",
      "Em paralelo, aconteceu a Mostra de Cinema dos Quilombos, na Sala Interartes, Casarão/IACS, Rua Lara Vilela, 126.",
      "A Mostra de Cinema dos Quilombos ocorreu nos dias 29 e 30 de novembro, das 18h às 21h.",
    ],
    gallery: [
      {
        label: "Seminário",
        url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000155-19b7519b78/700/404275078_920886799556176_2318967520888483703_n.webp?ph=3554c7d1fd",
      },
      {
        label: "Mostra de Cinema dos Quilombos",
        url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000157-4ec574ec58/404330495_920887742889415_3992810319862913119_n.webp?ph=3554c7d1fd",
      },
    ],
    links: [
      {
        label: "Inscrição Proex",
        href: "https://www.extensao.uff.br/inscricao/?curso=8805",
      },
    ],
  },
  {
    title: "V Mostra Cinema e Ditadura",
    period: "2023",
    image: "https://i.ytimg.com/vi/dsOuU9aKEl8/hqdefault.jpg",
    description:
      "A V Mostra Cinema e Ditadura integra as atividades do LACE com filmes, debates e reflexões sobre memória, gênero, raça, repressão e resistência durante a ditadura empresarial-militar brasileira.",
    links: [
      {
        label: "Abrir V Mostra",
        to: "/cinema-e-ditadura/v-mostra",
      },
    ],
  },
];

export default function Eventos2023() {
  const [activeEvent, setActiveEvent] = useState(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  function closeEvent() {
    setActiveEvent(null);
    setActiveGalleryIndex(0);
  }

  useEffect(() => {
    if (!activeEvent) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") closeEvent();
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        setActiveGalleryIndex((current) => {
          const galleryLength = activeEvent.gallery?.length || 1;
          const direction = event.key === "ArrowRight" ? 1 : -1;
          return (current + direction + galleryLength) % galleryLength;
        });
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeEvent]);

  return (
    <main className="bg-background py-20 lg:py-28">
      <Container>
        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Eventos e atividades</p>
          <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">Eventos 2023</h1>
        </header>

        <section className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Eventos 2023">
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
          activeGalleryIndex={activeGalleryIndex}
          onClose={closeEvent}
          onSelectGallery={setActiveGalleryIndex}
        />
      )}
    </main>
  );
}

function EventModal({ event, activeGalleryIndex, onClose, onSelectGallery }) {
  const activeGalleryImage = event.gallery?.[activeGalleryIndex];

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

        <section className="grid gap-8 pr-0 lg:grid-cols-[0.9fr_1.1fr] lg:pr-8">
          <div>
            <img
              className="max-h-[620px] w-full rounded-2xl border border-border object-contain"
              src={activeGalleryImage?.url || event.image}
              alt={activeGalleryImage?.label || event.title}
              decoding="async"
            />

            {event.gallery && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {event.gallery.map((image, index) => (
                  <button
                    key={image.url}
                    type="button"
                    onClick={() => onSelectGallery(index)}
                    className={`rounded-xl border p-1 text-left transition hover:border-primary ${
                      activeGalleryIndex === index ? "border-primary" : "border-border"
                    }`}
                  >
                    <img className="aspect-[4/3] w-full rounded-lg object-cover" src={image.url} alt="" loading="lazy" decoding="async" />
                    <span className="mt-1 block px-1 text-xs font-semibold uppercase tracking-wide text-primary">{image.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">{event.period}</p>
            <h2 id="event-modal-title" className="mt-3 pr-10 font-title text-4xl md:text-5xl">
              {event.title}
            </h2>
            <p className="mt-5 leading-8 text-muted">{event.description}</p>

            {event.details?.length > 0 && (
              <div className="mt-6 space-y-4 leading-8 text-muted">
                {event.details.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </div>
            )}

            {event.links?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {event.links.map((link) => (
                  link.to ? (
                    <Link
                      key={link.to}
                      className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary"
                      to={link.to}
                    >
                      {link.label} <ExternalLink size={16} aria-hidden="true" />
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label} <ExternalLink size={16} aria-hidden="true" />
                    </a>
                  )
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
