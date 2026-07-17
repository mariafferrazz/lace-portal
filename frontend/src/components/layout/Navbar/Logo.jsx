import HomeLink from "./HomeLink";

export default function Logo() {
  return (
    <HomeLink
      aria-label="LACE - Laboratório de Agenciamentos Cotidianos e Experiências - voltar ao início"
      className="flex items-center"
    >
      <img
        src="/logo-lace-transparent.png"
        alt="LACE - Laboratório de Agenciamentos Cotidianos e Experiências"
        className="h-12 w-auto object-contain md:h-14"
      />
    </HomeLink>
  );
}
