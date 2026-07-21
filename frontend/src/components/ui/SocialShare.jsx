import { useMemo, useState } from "react";
import { Copy, MessageCircle, Share2 } from "lucide-react";

function absoluteUrl(url) {
  if (typeof window === "undefined") return url || "";
  if (!url) return window.location.href;
  try {
    return new URL(url, window.location.origin).href;
  } catch {
    return window.location.href;
  }
}

export default function SocialShare({ title = "LACE", url, className = "" }) {
  const [status, setStatus] = useState("");
  const shareUrl = useMemo(() => absoluteUrl(url), [url]);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const links = [
    {
      label: "Facebook",
      mark: "f",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "LinkedIn",
      mark: "in",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Twitter",
      mark: "x",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  async function copyShareLink(message = "Link copiado.") {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus(message);
    } catch {
      setStatus("Copie o link da barra do navegador para compartilhar.");
    }
  }

  async function shareNative() {
    setStatus("");
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    await copyShareLink("Link copiado para compartilhar onde quiser.");
  }

  async function shareToInstagram() {
    setStatus("");
    await copyShareLink("Link copiado para compartilhar no Instagram.");
  }

  return (
    <section className={`border-t border-border pt-6 ${className}`} aria-label="Compartilhar conteúdo">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Compartilhar</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {links.map(({ label, mark, icon: Icon, href }) => (
          <a
            key={label}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            <span className="grid size-5 place-items-center rounded-full border border-current text-[10px] font-black uppercase leading-none" aria-hidden="true">
              {Icon ? <Icon size={13} /> : mark}
            </span>
            {label}
          </a>
        ))}
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={shareNative}
        >
          <span className="grid size-5 place-items-center rounded-full border border-current text-[10px] font-black uppercase leading-none" aria-hidden="true"><Share2 size={13} /></span>
          Compartilhar
        </button>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => copyShareLink("Link copiado.")}
        >
          <span className="grid size-5 place-items-center rounded-full border border-current text-[10px] font-black uppercase leading-none" aria-hidden="true"><Copy size={13} /></span>
          Copiar link
        </button>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={shareToInstagram}
        >
          <span className="grid size-5 place-items-center rounded-full border border-current text-[10px] font-black uppercase leading-none" aria-hidden="true">ig</span>
          Instagram
        </button>
      </div>
      {status && <p className="mt-3 text-sm text-muted" role="status">{status}</p>}
    </section>
  );
}
