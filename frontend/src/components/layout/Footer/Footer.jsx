import Container from "../../ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10 text-text">
      <Container className="flex flex-col gap-3 text-center text-sm text-muted md:flex-row md:items-center md:justify-between md:text-left">
        <p>LACE — Laboratório de Agenciamentos Cotidianos e Experiências</p>
        <p>Universidade Federal Fluminense · © {new Date().getFullYear()}</p>
      </Container>
    </footer>
  );
}
