import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Images, Mail, X } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";

const events = [
  {
    title: "Chamada para produção de verbetes",
    period: "2024",
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000163-741a2741a3/Chamada%20para%20verbetes%20%281%29.webp?ph=3554c7d1fd",
    description:
      "O Laboratório LACE abriu chamada para produção de verbetes sobre temas relacionados à Ditadura Empresarial Militar.",
    topics: [
      "Manicômios",
      "Relações Trabalhistas",
      "Empresas na Ditadura",
      "Quilombolas",
      "Indígenas",
      "Empresários na Ditadura",
      "Navios - Prisões",
    ],
    requirements: [
      "Título.",
      "Corpo do texto com mínimo de 350 palavras e máximo de 1000 palavras.",
      "O verbete pode conter 1 imagem de domínio público em anexo.",
      "Formato do documento em Word.",
      "Fonte Times, tamanho 11, espaçamento 1,5 e texto justificado.",
      "Bibliografia.",
      "Link para o Currículo Lattes.",
    ],
    dates: [
      "Prazo de submissão até 20 de março de 2024.",
      "Notificação de aceitação até 20 de abril de 2024.",
    ],
    submissionEmail: "lab.lace.uff@gmail.com",
  },
  {
    title: "VI Mostra Cinema e Ditadura",
    period: "2024",
    image: "https://i4.ytimg.com/vi/3y6GG61RCpg/hqdefault.jpg",
    description:
      "A VI Mostra Cinema e Ditadura reúne sessões, debates e materiais audiovisuais voltados à memória social, aos movimentos de resistência e às violações de direitos humanos durante a ditadura empresarial-militar brasileira.",
    links: [
      {
        label: "Abrir VI Mostra",
        to: "/cinema-e-ditadura/vi-mostra",
      },
    ],
  },
];

export default function Eventos2024() {
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    if (!activeEvent) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") setActiveEvent(null);
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
          <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">Eventos 2024</h1>
        </header>

        <section className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Eventos 2024">
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

      {activeEvent && <EventModal event={activeEvent} onClose={() => setActiveEvent(null)} />}
    </main>
  );
}

function EventModal({ event, onClose }) {
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

            {event.topics?.length > 0 && (
              <section className="mt-8">
                <h3 className="font-title text-3xl">Verbetes</h3>
                <ul className="mt-4 grid gap-2 text-muted sm:grid-cols-2">
                  {event.topics.map((topic) => (
                    <li key={topic} className="rounded-xl border border-border bg-card px-4 py-3">{topic}</li>
                  ))}
                </ul>
              </section>
            )}

            {event.requirements?.length > 0 && (
              <section className="mt-8">
                <h3 className="font-title text-3xl">Formato e requisitos</h3>
                <ul className="mt-4 space-y-3 leading-7 text-muted">
                  {event.requirements.map((requirement) => (
                    <li key={requirement}>{requirement}</li>
                  ))}
                </ul>
              </section>
            )}

            {event.dates?.length > 0 && (
              <section className="mt-8">
                <h3 className="font-title text-3xl">Datas importantes</h3>
                <ul className="mt-4 space-y-3 leading-7 text-muted">
                  {event.dates.map((date) => (
                    <li key={date}>{date}</li>
                  ))}
                </ul>
              </section>
            )}

            {event.submissionEmail && (
              <a
                className="mt-8 inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary"
                href={`mailto:${event.submissionEmail}`}
              >
                Enviar para {event.submissionEmail} <Mail size={16} aria-hidden="true" />
              </a>
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
