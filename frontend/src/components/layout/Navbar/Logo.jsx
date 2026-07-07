import HomeLink from "./HomeLink";

export default function Logo() {
  return (
    <HomeLink
      aria-label="LACE — voltar ao início"
      className="flex flex-col leading-none"
    >
      <span className="font-title text-3xl font-bold text-primary">
        LACE
      </span>

      <span className="text-[10px] uppercase tracking-[0.25em] text-text">
        Laboratório
      </span>
    </HomeLink>
  );
}
