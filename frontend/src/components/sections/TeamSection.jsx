import TeamCard from "../cards/TeamCard";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import { associatedResearchers, coordinators, students } from "../../data/team";

function TeamGroup({ title, people }) {
  return (
    <div className="mt-14 first:mt-0">
      <h3 className="mb-6 font-title text-3xl text-text md:text-4xl">{title}</h3>
      <div className="grid items-start gap-5 lg:grid-cols-2">
        {people.map((person) => <TeamCard key={person.name} {...person} />)}
      </div>
    </div>
  );
}

export default function TeamSection() {
  return (
    <section className="bg-surface py-24 lg:py-32">
      <Container>
        <SectionTitle subtitle="Pessoas" title="Equipe envolvida" />
        <TeamGroup title="Coordenação" people={coordinators} />
        <TeamGroup title="Pesquisadores associados" people={associatedResearchers} />
        <TeamGroup title="Estudantes" people={students} />
      </Container>
    </section>
  );
}
