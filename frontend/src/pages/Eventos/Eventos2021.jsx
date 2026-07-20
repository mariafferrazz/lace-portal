import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, ExternalLink, Images, X } from "lucide-react";
import Container from "../../components/ui/Container";

const events = [
  {
    title: "Tema: Filhos de atingidos pela ditadura",
    period: "19/08/2021 - 18h",
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000117-f2047f204b/15filhos.webp?ph=3554c7d1fd",
    oldUrl: "https://lab-lace.webnode.page/l/tema-filhos-de-atingidos-pela-ditadura/",
    description:
      "Em agosto, no dia 19/08 às 18h, tivemos a continuação da III Mostra Virtual Cinema e Ditadura. O filme dessa sessão foi 15 Filhos.",
    details: [
      "Sinopse: Como articular em pouco tempo vivências esparsas de um grupo de pessoas unidas pela mesma circunstância traumática? Documentário de 18 minutos que reúne depoimentos de filhas e filhos de guerrilheiros presos, mortos ou desaparecidos durante a ditadura civil-militar de 1964. Um filme feito em produção coletiva, na raça.",
    ],
  },
  {
    title: "Tema: Desaparecidos do Araguaia",
    period: "16/07/2021 - 18h",
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000131-0d1fd0d201/camp.webp?ph=3554c7d1fd",
    description:
      "Em julho, no dia 16/07 às 18h, tivemos a continuação da III Mostra Virtual Cinema e Ditadura com o filme Camponeses do Araguaia - A Guerrilha vista por dentro.",
    details: [
      "Sinopse: O documentário produzido pela Fundação Maurício Grabois e Oka Comunicações mostra camponeses que falam da amizade com os \"paulistas\", como chamavam os militantes do PCdoB que lutaram na Guerrilha do Araguaia durante a ditadura militar, e revelam as atrocidades cometidas pelo exército brasileiro na região entre 1972 e 1974.",
      "O evento foi transmitido ao vivo pelo Facebook e YouTube do LACE.",
    ],
  },
  {
    title: "III Mostra Virtual Cinema e Ditadura",
    period: "2021",
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000026-7a51b7a51d/Evento%20III%20Cine%201.jpg?ph=3554c7d1fd",
    videoUrl: "https://www.facebook.com/watch/?v=1700151500173920",
    calendarUrl: "https://www.lablace.com.br/cinema-e-ditadura/iii-mostra",
    description:
      "A III Mostra Virtual Cinema e Ditadura promoveu debates e reflexões sobre temas relacionados historicamente à ditadura militar brasileira, em diálogo com estudantes, pesquisadoras, pesquisadores e a sociedade.",
    details: [
      "A III Mostra Virtual Cinema e Ditadura faz parte das atividades do Laboratório de Agenciamentos Cotidianos e Experiências (LACE), que reúne dois Grupos de Pesquisa certificados no CNPq: Subjetividade, Memória e Violência do Estado (UFF), liderado pela Profª Drª Joana D'Arc Fernandes Ferraz, e Experiências de Trabalhadoras e Trabalhadores no Estado do Rio de Janeiro (UFRRJ), liderado pelo Prof. Dr. Rafael Maul.",
      "Esta Mostra teve como finalidade promover debates e reflexões sobre os mais variados temas relacionados historicamente à ditadura militar brasileira (1964-1985), tendo como público-alvo estudantes de Ensino Médio, de escolas públicas e privadas, em parceria com discentes da UFF e pesquisadores do tema.",
      "A atividade fez parte do Projeto de Extensão da UFF e garantiu certificado para os participantes. A interação com o público buscou estreitar os vínculos entre Universidade e sociedade, dialogando sobre este período marcante na história do país.",
      "Toda a Mostra foi exibida concomitantemente no canal do YouTube e no Facebook do LACE.",
    ],
    gallery: [
      {
        label: "Junho",
        url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000026-7a51b7a51d/Evento%20III%20Cine%201.jpg?ph=3554c7d1fd",
      },
      {
        label: "Julho",
        url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000027-23ff023ff2/Evento%20III%20Cine%202.jpg?ph=3554c7d1fd",
      },
      {
        label: "Agosto",
        url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000028-b8ddfb8de2/Evento%20III%20Cine%203.jpg?ph=3554c7d1fd",
      },
      {
        label: "Setembro",
        url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000029-5ccd55ccd7/Evento%20III%20Cine%204.jpg?ph=3554c7d1fd",
      },
      {
        label: "Outubro",
        url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000030-f3ceef3cf0/Evento%20III%20Cine%205.jpg?ph=3554c7d1fd",
      },
      {
        label: "Novembro",
        url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000031-8d6ae8d6b0/Evento%20III%20Cine%206.jpg?ph=3554c7d1fd",
      },
      {
        label: "Dezembro",
        url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000032-2997129974/Evento%20III%20Cine%207.jpg?ph=3554c7d1fd",
      },
      {
        label: "Janeiro de 2022",
        url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000033-b6b0ab6b0c/Evento%20III%20Cine%208.jpg?ph=3554c7d1fd",
      },
    ],
  },
  {
    title: "Cine Debate 2020: Que Bom Te Ver Viva",
    period: "07/08/2020 - 18h",
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000143-51b4951b4c/cine%20deb%2007.webp?ph=3554c7d1fd",
    description:
      "O Cine Debate 2020, em virtude da pandemia, aconteceu online no canal Parabolicamará - ICHF - UFF no Facebook.",
    details: ["Debate 5: Que Bom Te Ver Viva - 07/08/2020 - 18h."],
  },
  {
    title: "Cine Debate 2020: Artes Plásticas no período da Ditadura Empresarial Militar",
    period: "24/07/2020 - 18h",
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000144-0b0e50b0e9/Cine%20Deb%2031.webp?ph=3554c7d1fd",
    description:
      "O Cine Debate 2020, em virtude da pandemia, aconteceu online no canal Parabolicamará - ICHF - UFF no Facebook.",
    details: [
      "Debate 4: Apocalipopótese: Guerra e Paz - 24/07/2020 - 18h.",
      "Próximo Cine Debate: 07/08/2020 - 18h - Que Bom Te Ver Viva.",
    ],
  },
  {
    title: "Cine Debate 2020: Economia no período da Ditadura Empresarial Militar",
    period: "24/07/2020 - 18h",
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000145-b0953b0958/Cine%20Deb%2024.webp?ph=3554c7d1fd",
    description:
      "O Cine Debate 2020, em virtude da pandemia, aconteceu online no canal Parabolicamará - ICHF - UFF no Facebook.",
    details: [
      "Debate 3: IPES - 24/07/2020 - 18h.",
      "Próximo Cine Debate: 31/07/2020 - 18h - Apocalipopótese: Guerra e Paz.",
    ],
  },
  {
    title: "Cine Debate 2020: Lei da Anistia",
    period: "17/07/2020 - 18h",
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000146-6f6d66f6d9/Cine%20deb%2017.webp?ph=3554c7d1fd",
    description:
      "O Cine Debate 2020, em virtude da pandemia, aconteceu online no canal Parabolicamará - ICHF - UFF no Facebook.",
    details: [
      "Debate 2: Damas da Liberdade - 17/07/2020 - 18h.",
      "Próximo Cine Debate: 24/07/2020 - 18h - IPES.",
      "Debate 1: Memória para Uso Diário - 19/06/2020 - 18h.",
    ],
  },
  {
    title: "3° Mostra do Filme Marginal",
    period: "2020",
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000147-5d3d05d3d3/700/filme%20marginal%202017.webp?ph=3554c7d1fd",
    description:
      "A Mostra do Filme Marginal é um encontro anual que busca dar visibilidade à produção audiovisual independente e provocar reflexão sobre temas importantes, muitas vezes ignorados pela sociedade.",
    details: [
      "Não é um evento competitivo: a proposta é de integração. Já foram realizadas duas edições anteriores, em 2017, no Rio de Janeiro/RJ, e 2018.",
    ],
  },
];

const eventDisplayOrder = [
  "Cine Debate 2020: Lei da Anistia",
  "Cine Debate 2020: Economia no período da Ditadura Empresarial Militar",
  "Cine Debate 2020: Artes Plásticas no período da Ditadura Empresarial Militar",
  "Cine Debate 2020: Que Bom Te Ver Viva",
  "3° Mostra do Filme Marginal",
  "III Mostra Virtual Cinema e Ditadura",
  "Tema: Desaparecidos do Araguaia",
  "Tema: Filhos de atingidos pela ditadura",
];

export default function Eventos2021() {
  const [activeEvent, setActiveEvent] = useState(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const orderedEvents = useMemo(
    () => eventDisplayOrder.map((title) => events.find((event) => event.title === title)).filter(Boolean),
    [],
  );
  const activeEventIndex = useMemo(
    () => orderedEvents.findIndex((event) => event.title === activeEvent?.title),
    [activeEvent, orderedEvents],
  );

  function closeEvent() {
    setActiveEvent(null);
    setActiveGalleryIndex(0);
  }

  const navigateEvent = useCallback((direction) => {
    if (!activeEvent) return;

    const nextIndex =
      direction === "previous"
        ? (activeEventIndex - 1 + orderedEvents.length) % orderedEvents.length
        : (activeEventIndex + 1) % orderedEvents.length;

    setActiveEvent(orderedEvents[nextIndex]);
    setActiveGalleryIndex(0);
  }, [activeEvent, activeEventIndex, orderedEvents]);

  useEffect(() => {
    if (!activeEvent) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") closeEvent();
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
          <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">Eventos 2020/21</h1>
        </header>

        <section className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Eventos 2020 e 2021">
          {orderedEvents.map((event) => (
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
          onNavigate={navigateEvent}
          onSelectGallery={setActiveGalleryIndex}
        />
      )}
    </main>
  );
}

function EventModal({ event, activeGalleryIndex, onClose, onNavigate, onSelectGallery }) {
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
          <div>
            {activeGalleryImage ? (
              <img
                className="max-h-[620px] w-full rounded-2xl border border-border object-contain"
                src={activeGalleryImage.url}
                alt={activeGalleryImage.label}
                decoding="async"
              />
            ) : (
              <img
                className="max-h-[620px] w-full rounded-2xl border border-border object-contain"
                src={event.image}
                alt={event.title}
                decoding="async"
              />
            )}

            {event.gallery && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
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

            <div className="mt-8 flex flex-wrap gap-3">
              {event.videoUrl && (
                <a
                  className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary"
                  href={event.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Vídeo da programação <ExternalLink size={16} aria-hidden="true" />
                </a>
              )}
              {event.calendarUrl && (
                <a
                  className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary"
                  href={event.calendarUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Calendário <ExternalLink size={16} aria-hidden="true" />
                </a>
              )}
              {event.oldUrl && (
                <a
                  className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary"
                  href={event.oldUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Referência original <ExternalLink size={16} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>,
    document.body,
  );
}
