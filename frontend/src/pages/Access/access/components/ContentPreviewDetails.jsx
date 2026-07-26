import { typeLabel, uniqueUrls } from "../utils";

function LinkList({ title, urls = [] }) {
  const clean = uniqueUrls(urls);
  if (!clean.length) return null;
  return <section className="rounded-2xl border border-border bg-card p-5"><h3 className="font-title text-2xl">{title}</h3><div className="mt-4 flex flex-wrap gap-3">{clean.map((url, index) => <a key={url} className="rounded-xl border border-primary/60 px-4 py-3 text-sm font-semibold text-primary" href={url} target="_blank" rel="noreferrer">Abrir {index + 1}</a>)}</div></section>;
}

function ObjectCards({ title, items = [], render }) {
  if (!items.length) return null;
  return <section className="rounded-2xl border border-border bg-card p-5"><h3 className="font-title text-2xl">{title}</h3><div className="mt-4 space-y-3">{items.map((item, index) => <article key={index} className="rounded-xl border border-border bg-background p-4">{render(item, index)}</article>)}</div></section>;
}

export default function ContentPreviewDetails({ content }) {
  const metadata = content.metadata || {};
  return <div className="mt-6 space-y-6">
    {content.description && <section className="rounded-2xl border border-border bg-card p-5"><h3 className="font-title text-2xl">Descrição</h3><div className="mt-3 whitespace-pre-line leading-7 text-muted">{content.description}</div></section>}
    {metadata.bodyText && <section className="rounded-2xl border border-border bg-card p-5"><h3 className="font-title text-2xl">Texto</h3><div className="mt-3 whitespace-pre-line leading-7 text-muted">{metadata.bodyText}</div></section>}
    <LinkList title="Mídia principal" urls={[metadata.videoUrl, metadata.podcastUrl, metadata.pdfUrl, content.externalUrl, content.fileUrl]} />
    <ObjectCards title="Episódios" items={metadata.episodes} render={(item) => <><strong>{item.title || "Sem título"}</strong>{item.description && <p className="mt-2 text-muted">{item.description}</p>}{item.url && <a className="mt-3 inline-block text-primary" href={item.url} target="_blank" rel="noreferrer">Abrir episódio</a>}</>} />
    <ObjectCards title="Pessoas e equipe" items={metadata.people || metadata.team} render={(item) => <><strong>{item.name || "Sem nome"}</strong>{item.role && <p className="text-sm text-primary">{item.role}</p>}{item.description && <p className="mt-2 text-muted">{item.description}</p>}</>} />
    <ObjectCards title="Informações adicionais" items={metadata.credits || metadata.additionalInfo} render={(item) => <><strong>{item.title || item.value || "Informação"}</strong>{item.value && item.title && <p className="mt-1 text-text">{item.value}</p>}{item.description && <p className="mt-2 text-muted">{item.description}</p>}</>} />
    <ObjectCards title="Recursos" items={metadata.resources} render={(item) => <><strong>{item.title || typeLabel(item.kind)}</strong>{item.url && <a className="mt-2 block text-primary" href={item.url} target="_blank" rel="noreferrer">Abrir recurso</a>}</>} />
    <ObjectCards title="Sessões" items={metadata.sessions} render={(item, index) => <><strong>Sessão {index + 1}: {item.film?.title || item.title || "Sem título"}</strong><p className="mt-1 text-sm text-muted">{item.date || "Sem data"}</p><LinkList title="Links da sessão" urls={item.sessionUrls || [item.sessionUrl]} /></>} />
  </div>;
}
