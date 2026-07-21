import { useEffect, useMemo, useState } from "react";
import TeamCard from "../cards/TeamCard";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import { teamMembers } from "../../data/team";
import api from "../../services/api";

function TeamGrid({ people }) {
  return (
    <div className="mt-14">
      <div className="grid items-start gap-5 lg:grid-cols-2">
        {people.map((person) => <TeamCard key={person.name} {...person} />)}
      </div>
    </div>
  );
}

export default function TeamSection() {
  const [members, setMembers] = useState(null);
  const people = useMemo(() => (members?.length ? members : teamMembers), [members]);

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
        <SectionTitle subtitle="Pessoas" title="Equipe LACE" />
        <TeamGrid people={people} />
      </Container>
    </section>
  );
}
