import Container from "../ui/Container";
import StatisticCard from "../cards/StatisticCard";

const statistics = [
  ["2", "Grupos de pesquisa", "Certificados pelo CNPq."],
  ["20+", "Pesquisadores", "Docentes, pesquisadores e estudantes."],
  ["7", "Mostras", "Edições da Mostra Cinema e Ditadura."],
  ["100+", "Produções", "Artigos, podcasts, entrevistas e pesquisas."],
];

export default function StatisticsSection() {
  return (
    <section className="border-y border-border bg-surface py-20" aria-label="LACE em números">
      <Container className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map(([number, title, description]) => (
          <StatisticCard key={title} number={number} title={title} description={description} />
        ))}
      </Container>
    </section>
  );
}
