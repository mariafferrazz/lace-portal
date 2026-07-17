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
        className="site-logo-image site-logo-image-light h-14 w-auto object-contain md:h-16"
      />
      <img
        src="/logo-lace-transparent-dark.png"
        alt=""
        aria-hidden="true"
        className="site-logo-image site-logo-image-dark h-14 w-auto object-contain md:h-16"
      />
    </HomeLink>
  );
}
