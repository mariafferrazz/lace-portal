import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, BookOpenText, ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import ContentCredit from "../../components/ui/ContentCredit";
import api from "../../services/api";
import { getStaticContents } from "../../data/staticContent";

const alphabet = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVZ".split("")];
const initialLetter = (title) => {
  const letter = title.trim().charAt(0).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  return /^[A-Z]$/.test(letter) ? letter : "#";
};
const limitWords = (text, limit) => {
  const words = text.trim().split(/\s+/);
  return words.length > limit ? `${words.slice(0, limit).join(" ")}…` : text;
};

export default function Verbetes() {
  const [entries, setEntries] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/contents", { params: { type: "GLOSSARY" } })
      .then(({ data }) => setEntries(data.contents))
      .catch(async () => {
        setEntries(await getStaticContents("GLOSSARY"));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedEntry) return undefined;
    const close = (event) => event.key === "Escape" && setSelectedEntry(null);
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", close); document.body.style.overflow = ""; };
  }, [selectedEntry]);

  useEffect(() => {
    if (selectedEntry) return undefined;
    const navigate = (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const available = alphabet.filter((letter) => entries.some((entry) => initialLetter(entry.title) === letter));
      if (available.length < 2) return;
      const current = Math.max(0, available.indexOf(selectedLetter));
      setSelectedLetter(available[(current + (event.key === 'ArrowRight' ? 1 : -1) + available.length) % available.length]);
    };
    document.addEventListener("keydown", navigate);
    return () => document.removeEventListener("keydown", navigate);
  }, [entries, selectedEntry, selectedLetter]);

  const availableLetters = useMemo(
    () => new Set(entries.map((entry) => initialLetter(entry.title))),
    [entries],
  );
  const visibleLetters = useMemo(
    () => alphabet.filter((letter) => availableLetters.has(letter)),
    [availableLetters],
  );
  const visibleEntries = useMemo(
    () => entries.filter((entry) => initialLetter(entry.title) === selectedLetter),
    [entries, selectedLetter],
  );
  const selectedIndex = useMemo(
    () => selectedEntry ? visibleEntries.findIndex((entry) => entry.id === selectedEntry.id) : -1,
    [selectedEntry, visibleEntries],
  );
  const previousEntry = selectedIndex >= 0 ? visibleEntries[(selectedIndex - 1 + visibleEntries.length) % visibleEntries.length] : null;
  const nextEntry = selectedIndex >= 0 ? visibleEntries[(selectedIndex + 1) % visibleEntries.length] : null;

  return <main className="bg-background py-20 lg:py-28"><Container>
    <header className="max-w-4xl"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Cinema e Ditadura</p><h1 className="mt-4 font-title text-5xl md:text-7xl">Verbetes</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-muted">Conceitos, acontecimentos e contextos históricos relacionados à <strong className="text-primary">Ditadura Militar Empresarial Brasileira</strong>.</p></header>
    {loading && <p className="mt-14 text-muted">Carregando verbetes…</p>}
    {entries.length > 0 && <>
      <nav className="mt-12 flex flex-wrap gap-2" aria-label="Filtrar verbetes por letra">{visibleLetters.map((letter) => { const active = selectedLetter === letter; return <button key={letter} aria-pressed={active} onClick={() => setSelectedLetter(letter)} className={`grid size-11 cursor-pointer place-items-center rounded-xl border font-bold transition ${active ? "border-primary bg-primary-fill text-on-primary" : "border-border bg-card hover:border-primary hover:text-primary"}`}>{letter}</button>; })}</nav>
      <p className="mt-6 text-sm text-muted">{visibleEntries.length} {visibleEntries.length === 1 ? "verbete" : "verbetes"} com a letra {selectedLetter}</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{visibleEntries.map((entry) => <article key={entry.id} role="button" tabIndex={0} aria-label={`Ler verbete ${entry.title}`} onClick={() => setSelectedEntry(entry)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedEntry(entry); } }} className="flex cursor-pointer flex-col rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-primary focus-visible:-translate-y-1 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><BookOpenText className="text-primary" aria-hidden="true" /><h2 className="mt-5 font-title text-4xl">{entry.title}</h2><p className="mt-4 flex-1 leading-7 text-muted">{limitWords(entry.description || "Verbete em preparação.", 45)}</p><ContentCredit content={entry} label="Autoria" className="mt-5" linkName={false} /><span className="mt-6 inline-flex items-center gap-2 self-start font-semibold text-primary">Ler verbete <ArrowRight size={16} /></span></article>)}</div>
    </>}
  </Container>{selectedEntry && <GlossaryModal key={selectedEntry.id} entry={selectedEntry} onClose={() => setSelectedEntry(null)} onPrevious={() => setSelectedEntry(previousEntry)} onNext={() => setSelectedEntry(nextEntry)} navigationEnabled={visibleEntries.length > 1} />}</main>;
}

function GlossaryModal({ entry, onClose, onPrevious, onNext, navigationEnabled }) {
  const [expanded, setExpanded] = useState(false);
  const text = entry.description || "Verbete em preparação.";
  const relatedFilms = entry.metadata?.relatedFilms || [];
  useEffect(() => {
    const navigate = (event) => {
      if (!navigationEnabled) return;
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", navigate);
    return () => document.removeEventListener("keydown", navigate);
  }, [navigationEnabled, onNext, onPrevious]);
  return createPortal(<div className="fixed inset-0 overflow-y-auto bg-background" style={{ zIndex: 9999 }} role="dialog" aria-modal="true" aria-labelledby="glossary-title">
    <div className="sticky top-0 z-10 flex justify-end border-b border-border bg-background p-4"><button className="cursor-pointer rounded-full border border-border bg-card p-3 hover:border-primary hover:text-primary" onClick={onClose} aria-label="Fechar verbete"><X /></button></div>
    {navigationEnabled && <>
      <button className="fixed left-3 top-1/2 z-40 grid -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-border bg-card p-3 text-text shadow-xl transition hover:border-primary hover:text-primary md:left-6 md:p-4" type="button" onClick={onPrevious} aria-label="Verbete anterior"><ChevronLeft size={32} aria-hidden="true" /></button>
      <button className="fixed right-3 top-1/2 z-40 grid -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-border bg-card p-3 text-text shadow-xl transition hover:border-primary hover:text-primary md:right-6 md:p-4" type="button" onClick={onNext} aria-label="Próximo verbete"><ChevronRight size={32} aria-hidden="true" /></button>
    </>}
    <article className="mx-auto max-w-5xl px-6 py-10 md:px-12 md:py-16"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Verbete</p><h2 id="glossary-title" className="mt-3 font-title text-5xl md:text-7xl">{entry.title}</h2><ContentCredit content={entry} label="Autoria" className="mt-5" />
      <GlossaryText text={expanded ? text : limitWords(text, 180)} inlineImages={entry.metadata?.inlineImages} />
      {text.trim().split(/\s+/).length > 180 && <button className="mt-6 cursor-pointer rounded-xl border border-primary px-5 py-3 font-semibold text-primary hover:bg-primary-fill hover:text-on-primary" onClick={() => setExpanded((value) => !value)}>{expanded ? "Recolher texto" : "Expandir texto completo"}</button>}
      {entry.metadata?.sourceUrl && <p className="mt-10"><a className="inline-flex items-center gap-2 font-semibold text-primary" href={entry.metadata.sourceUrl} target="_blank" rel="noreferrer">Consultar fonte <ExternalLink size={16} /></a></p>}
      {relatedFilms.length > 0 && <section className="mt-12 border-t border-border pt-8"><h3 className="font-title text-3xl">Filmes relacionados</h3><div className="mt-5 flex flex-wrap gap-3">{relatedFilms.map((film) => <Link key={film.id} className="rounded-xl border border-border bg-card px-4 py-3 font-semibold text-primary hover:border-primary" to={`/cinema-e-ditadura/filmes?filme=${film.id}`}>{film.title}</Link>)}</div></section>}
      {entry.metadata?.authorBio && <section className="mt-12 border-t border-border pt-8"><h3 className="font-title text-3xl">Sobre a autoria</h3><p className="mt-5 leading-7 text-muted"><strong className="text-text">{entry.researcherName}</strong> — {entry.metadata.authorBio}</p></section>}
      {entry.metadata?.references && <section className="mt-12 border-t border-border pt-8"><h3 className="font-title text-3xl">Referências bibliográficas</h3><div className="mt-5 whitespace-pre-line leading-7 text-muted">{entry.metadata.references}</div></section>}
    </article>
  </div>, document.body);
}

function GlossaryText({ text, inlineImages = [] }) {
  const images = inlineImages.map((image) => ({ ...image, index: text.indexOf(image.afterText) })).filter((image) => image.index >= 0).sort((a, b) => a.index - b.index);
  if (!images.length) return <div className="mt-10 whitespace-pre-line text-lg leading-9 text-text">{text}</div>;
  let cursor = 0;
  const parts = [];
  images.forEach((image, index) => {
    const splitAt = image.index + image.afterText.length;
    parts.push(<div key={`text-${index}`} className="whitespace-pre-line">{text.slice(cursor, splitAt)}</div>);
    parts.push(<figure key={image.src} className="my-10 overflow-hidden rounded-2xl border border-border bg-card"><img className="max-h-[70vh] w-full object-contain" src={image.src} alt={image.alt} loading="lazy" decoding="async" />{image.caption && <figcaption className="border-t border-border px-5 py-3 text-sm text-muted">{image.caption}</figcaption>}</figure>);
    cursor = splitAt;
  });
  parts.push(<div key="text-end" className="whitespace-pre-line">{text.slice(cursor)}</div>);
  return <div className="mt-10 text-lg leading-9 text-text">{parts}</div>;
}
