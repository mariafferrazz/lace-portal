import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const supporters = [
  {
    name: "UFF",
    src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000070-6af046af06/450/download.jpg?ph=3554c7d1fd",
    alt: "Universidade Federal Fluminense — UFF",
  },
  {
    name: "Red Iberoamericana de Cine y Derecho",
    src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000102-ab075ab079/450/rede.webp?ph=3554c7d1fd",
    alt: "Red Iberoamericana de Cine y Derecho",
  },
  {
    name: "GTNM",
    src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000103-ef31aef31d/450/tortura.webp?ph=3554c7d1fd",
    alt: "Grupo Tortura Nunca Mais do Rio de Janeiro",
  },
  {
    name: "PROEX/UFF",
    src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000081-1b9b31b9b6/450/proexuff-8.jpg?ph=3554c7d1fd",
    alt: "Pró-Reitoria de Extensão da Universidade Federal Fluminense",
  },
  {
    name: "FAPERJ",
    src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000105-c74a9c74ad/700/unnamed-1.webp?ph=3554c7d1fd",
    alt: "Fundação Carlos Chagas Filho de Amparo à Pesquisa do Estado do Rio de Janeiro — FAPERJ",
  },
  {
    name: "PPGS/UFF",
    src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000104-7c9a67c9a9/450/ppgs%20do%20site.webp?ph=3554c7d1fd",
    alt: "Programa de Pós-Graduação em Sociologia da Universidade Federal Fluminense",
  },
];

export default function SupportersSection() {
  return (
    <section className="bg-background py-24 lg:py-32" aria-labelledby="supporters-title">
      <Container>
        <SectionTitle id="supporters-title" subtitle="Parcerias" title="Apoio" />
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {supporters.map((supporter) => (
            <figure key={supporter.src} className="flex min-h-52 flex-col items-center justify-between gap-5 rounded-2xl border border-border bg-white p-6 text-center transition hover:-translate-y-1 hover:border-primary">
              <img
                src={supporter.src}
                alt={supporter.alt}
                className="max-h-32 w-full object-contain"
                loading="lazy"
                width="450"
                height="180"
              />
              <figcaption className="text-sm font-semibold uppercase tracking-wide text-zinc-800">{supporter.name}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
