import { useEffect, useMemo, useState } from "react";
import TeamCard from "../cards/TeamCard";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import { associatedResearchers, coordinators, students } from "../../data/team";
import api from "../../services/api";

const fallbackGroups = [
  { title: "Coordenação", people: coordinators },
  { title: "Pesquisadores associados", people: associatedResearchers },
  { title: "Estudantes", people: students },
];

const groupTitles = {
  COORDINATION: "Coordenação",
  ASSOCIATED_RESEARCHER: "Pesquisadores associados",
  STUDENT: "Estudantes",
};

function groupTeamMembers(members) {
  const grouped = new Map();
  for (const member of members) {
    const title = groupTitles[member.group] || "Equipe";
    if (!grouped.has(title)) grouped.set(title, []);
    grouped.get(title).push(member);
  }
  return Array.from(grouped.entries()).map(([title, people]) => ({ title, people }));
}

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
  const [members, setMembers] = useState(null);
  const groups = useMemo(() => (members?.length ? groupTeamMembers(members) : fallbackGroups), [members]);

  useEffect(() => {
    let active = true;
    api.get("/team")
      .then(({ data }) => {
        if (active) setMembers(data.members || []);
      })
      .catch(() => {
        if (active) setMembers(null);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="equipe" className="scroll-mt-24 bg-surface py-24 lg:py-32">
      <Container>
        <SectionTitle subtitle="Pessoas" title="Equipe envolvida" />
        {groups.map((group) => <TeamGroup key={group.title} title={group.title} people={group.people} />)}
      </Container>
    </section>
  );
}
