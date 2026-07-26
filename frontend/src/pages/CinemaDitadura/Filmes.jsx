import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ExternalLink, Film, Play, X } from "lucide-react";
import Container from "../../components/ui/Container";
import ContentCredit from "../../components/ui/ContentCredit";
import SocialShare from "../../components/ui/SocialShare";
import api from "../../services/api";
import { getStaticContents } from "../../data/staticContent";
import {
  contentDirection,
  contentFileUrls,
  contentImage,
  contentVideo,
} from "../../utils/contentMetadata";

function limitWords(text, limit = 40) {
  const words = text.trim().split(/\s+/);
  return words.length > limit ? `${words.slice(0, limit).join(" ")}…` : text;
}

const alphabet = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVZ".split("")];
const initialLetter = (content) => {
  const storedLetter = String(content?.metadata?.alphabetLetter || "").toUpperCase();
  if (/^[A-Z]$/.test(storedLetter)) return storedLetter;
  const title = typeof content === "string" ? content : content?.title || "";
  const letter = title.trim().charAt(0).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  return /^[A-Z]$/.test(letter) ? letter : "#";
};

const normalizedContentKey = (content) =>
  content.title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function mergeFilms(apiFilms = [], fallbackFilms = []) {
  const seen = new Set();
  return [...apiFilms, ...fallbackFilms].filter((film) => {
    const key = normalizedContentKey(film);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function Filmes() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState("A");

  useEffect(() => {
    const applyFilms = (contents) => {
      setFilms(contents);
      const requestedFilm = new URLSearchParams(window.location.search).get("filme");
      if (requestedFilm) setSelectedFilm(contents.find((film) => film.id === requestedFilm) || null);
    };

    api.get("/contents", { params: { type: "FILM" } })
      .then(({ data }) => {
        applyFilms(mergeFilms(data.contents || []));
      })
      .catch(async () => {
        applyFilms(await getStaticContents("FILM"));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedFilm) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && setSelectedFilm(null);
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [selectedFilm]);

  useEffect(() => {
    if (selectedFilm) return undefined;
    const navigateLetters = (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
      const available = alphabet.filter((letter) => films.some((film) => initialLetter(film.title) === letter));
      if (available.length < 2) return;
      const currentIndex = Math.max(0, available.indexOf(selectedLetter));
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (currentIndex + direction + available.length) % available.length;
      event.preventDefault();
      setSelectedLetter(available[nextIndex]);
    };
    document.addEventListener('keydown', navigateLetters);
    return () => document.removeEventListener('keydown', navigateLetters);
  }, [films, selectedFilm, selectedLetter]);

  const availableLetters = useMemo(
    () => new Set(films.map((film) => initialLetter(film))),
    [films],
  );
  const visibleFilms = useMemo(
    () => films.filter((film) => initialLetter(film) === selectedLetter),
    [films, selectedLetter],
  );
  const selectedIndex = useMemo(
    () => selectedFilm ? visibleFilms.findIndex((film) => film.id === selectedFilm.id) : -1,
    [selectedFilm, visibleFilms],
  );
  const previousFilm = selectedIndex >= 0 ? visibleFilms[(selectedIndex - 1 + visibleFilms.length) % visibleFilms.length] : null;
  const nextFilm = selectedIndex >= 0 ? visibleFilms[(selectedIndex + 1) % visibleFilms.length] : null;

  return (
    <main className="bg-background py-20 lg:py-28">
      <Container>
        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Cinema e Ditadura</p>
          <h1 className="mt-4 font-title text-5xl md:text-7xl">Filmes</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">Nossa lista de filmes relacionados à <strong className="font-bold text-primary">Ditadura Militar Empresarial Brasileira</strong>.</p>
        </header>

        {loading && <p className="mt-14 text-muted">Carregando filmes…</p>}
        {!loading && films.length === 0 && (
          <div className="mt-14 rounded-3xl border border-dashed border-border bg-card/50 p-10">
            <Film className="text-primary" aria-hidden="true" />
            <h2 className="mt-5 font-title text-3xl">Acervo em preparação</h2>
            <p className="mt-3 text-muted">Os filmes serão publicados aqui em ordem alfabética.</p>
          </div>
        )}
        {films.length > 0 && (
          <>
          <nav className="mt-12 flex flex-wrap gap-2" aria-label="Filtrar filmes por letra inicial">
            {alphabet.map((letter) => {
              const available = availableLetters.has(letter);
              const active = selectedLetter === letter;
              return <button key={letter} type="button" disabled={!available} aria-pressed={active} onClick={() => setSelectedLetter(letter)} className={`grid size-11 place-items-center rounded-xl border font-bold transition ${active ? "border-primary bg-primary-fill text-on-primary" : available ? "cursor-pointer border-border bg-card text-text hover:border-primary hover:text-primary" : "cursor-not-allowed border-border/50 text-muted/40"}`}>{letter}</button>;
            })}
          </nav>
          <p className="mt-6 text-sm text-muted">{visibleFilms.length} {visibleFilms.length === 1 ? "filme" : "filmes"} com a letra {selectedLetter}</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleFilms.map((film) => (
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary" key={film.id}>
                <button className="relative cursor-pointer text-left" type="button" onClick={() => setSelectedFilm(film)} aria-label={`Abrir ${film.title}`}>
                  {contentImage(film) ? <img className="aspect-video w-full object-cover" src={contentImage(film)} alt="" loading="lazy" decoding="async" /> : <div className="grid aspect-video place-items-center bg-surface"><Film className="text-primary" /></div>}
                  <span className="absolute inset-0 grid place-items-center bg-black/20 transition group-hover:bg-black/40"><span className="grid size-14 place-items-center rounded-full bg-primary-fill text-on-primary shadow-xl"><Play fill="currentColor" aria-hidden="true" /></span></span>
                </button>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap gap-x-3 text-xs font-semibold uppercase tracking-widest text-primary">
                    {film.metadata?.year && <span>{film.metadata.year}</span>}
                    {contentDirection(film) && <span>{contentDirection(film)}</span>}
                  </div>
                  <h2 className="mt-3 font-title text-3xl">{film.title}</h2>
                  {film.description && <p className="mt-4 flex-1 leading-7 text-muted">{limitWords(film.description)}</p>}
                  <ContentCredit content={film} label="Pesquisa" className="mt-5" linkName={false} />
                  <button className="mt-5 inline-flex cursor-pointer items-center gap-2 self-start font-semibold text-primary" type="button" onClick={() => setSelectedFilm(film)}>Ver mais <Play size={16} aria-hidden="true" /></button>
                </div>
              </article>
            ))}
          </div>
          </>
        )}
      </Container>
      {selectedFilm && <FilmModal key={selectedFilm.id} film={selectedFilm} onClose={() => setSelectedFilm(null)} onPrevious={() => setSelectedFilm(previousFilm)} onNext={() => setSelectedFilm(nextFilm)} navigationEnabled={visibleFilms.length > 1} />}
    </main>
  );
}

function FilmModal({ film, onClose, onPrevious, onNext, navigationEnabled }) {
  const { youtubeId: videoId, vimeoId } = contentVideo(film);
  const direction = contentDirection(film);
  const [playerStarted, setPlayerStarted] = useState(false);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?wmode=opaque&autoplay=1`
    : vimeoId ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1` : null;
  const previewImage = contentImage(film);
  const filmLinks = contentFileUrls(film);

  useEffect(() => {
    const navigateWithKeyboard = (event) => {
      if (event.key === "ArrowLeft" && navigationEnabled) onPrevious();
      if (event.key === "ArrowRight" && navigationEnabled) onNext();
    };
    document.addEventListener("keydown", navigateWithKeyboard);
    return () => document.removeEventListener("keydown", navigateWithKeyboard);
  }, [navigationEnabled, onNext, onPrevious]);

  return createPortal(
    <div className="fixed inset-0 overflow-y-auto bg-card" style={{ zIndex: 9999 }} role="dialog" aria-modal="true" aria-labelledby="film-modal-title">
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-30 flex justify-end border-b border-border bg-background p-3 md:p-5">
          <button className="grid cursor-pointer place-items-center rounded-full border border-border bg-card p-3 text-text shadow-xl transition hover:border-primary hover:text-primary" type="button" onClick={onClose} aria-label="Fechar filme"><X size={28} aria-hidden="true" /></button>
        </div>
        {navigationEnabled && <>
          <button className="fixed left-3 top-1/2 z-40 grid -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-border bg-card p-3 text-text shadow-xl transition hover:border-primary hover:text-primary md:left-6 md:p-4" type="button" onClick={onPrevious} aria-label="Filme anterior"><ChevronLeft size={32} aria-hidden="true" /></button>
          <button className="fixed right-3 top-1/2 z-40 grid -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-border bg-card p-3 text-text shadow-xl transition hover:border-primary hover:text-primary md:right-6 md:p-4" type="button" onClick={onNext} aria-label="Próximo filme"><ChevronRight size={32} aria-hidden="true" /></button>
        </>}
        <div className="mx-auto w-full px-4 md:px-8">
          <div className="relative mx-auto w-full overflow-hidden rounded-2xl bg-black shadow-2xl" style={{ aspectRatio: "16 / 9", maxWidth: "min(1280px, calc(72vh * 16 / 9))" }}>
          {embedUrl && playerStarted ? (
            <iframe
              key={videoId}
              className="absolute inset-0 block h-full w-full border-0"
              src={embedUrl}
              title={`Filme ${film.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="eager"
              allowFullScreen
            />
          ) : embedUrl ? (
            <button className="group absolute inset-0 h-full w-full cursor-pointer bg-black" type="button" onClick={() => setPlayerStarted(true)} aria-label={`Reproduzir ${film.title}`}>
              {previewImage ? <img className="h-full w-full object-cover" src={previewImage} alt="" decoding="async" /> : <span className="absolute inset-0 grid place-items-center px-8 text-center font-title text-3xl text-white md:text-5xl">{film.title}</span>}
              <span className="absolute inset-0 grid place-items-center bg-black/15 transition group-hover:bg-black/30">
                <span className="grid h-16 w-24 place-items-center rounded-2xl bg-red-600 text-white shadow-2xl transition group-hover:scale-110 md:h-20 md:w-28">
                  <Play size={40} fill="currentColor" aria-hidden="true" />
                </span>
              </span>
            </button>
          ) : <div className="grid h-full place-items-center text-white">Player indisponível.</div>}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10 lg:px-14">
          <h2 className="font-title text-4xl md:text-6xl" id="film-modal-title">{film.title}</h2>
          <div className="flex flex-wrap gap-2 text-sm font-semibold text-primary">
            {direction && <span>Direção: {direction}</span>}
            {film.metadata?.country && <span>· {film.metadata.country}</span>}
            {film.metadata?.year && <span>· {film.metadata.year}</span>}
            {film.metadata?.duration && <span>· {film.metadata.duration}</span>}
            {film.metadata?.genre && <span>· {film.metadata.genre}</span>}
          </div>
          <div className="mt-6 whitespace-pre-line leading-8 text-muted">{film.description}</div>
          <ContentCredit content={film} label="Pesquisa" className="mt-6" />
          {filmLinks.map((url, index) => (
            <a key={url} className="mr-6 mt-6 inline-flex items-center gap-2 font-semibold text-primary" href={url} target="_blank" rel="noreferrer">
              Abrir filme {filmLinks.length > 1 ? index + 1 : ""} <ExternalLink size={16} aria-hidden="true" />
            </a>
          ))}
          {film.metadata?.website && <a className="ml-6 mt-6 inline-flex items-center gap-2 font-semibold text-primary" href={film.metadata.website} target="_blank" rel="noreferrer">Site do filme <ExternalLink size={16} aria-hidden="true" /></a>}
          <SocialShare title={film.title} url={`/cinema-e-ditadura/filmes?filme=${film.id}`} className="mt-8" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
