import { Link } from "react-router-dom";

export default function EventCard({
  image,
  imageAlt = "",
  title,
  year,
  description,
  to,
  actionLabel = "Ver detalhes",
  featured = false,
}) {
  return (
    <Link
      to={to}
      className={`group h-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
        featured ? "grid lg:grid-cols-2" : "flex flex-col"
      }`}
    >
      <div className="overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={imageAlt || title}
            className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
              featured ? "h-full min-h-80" : "h-60"
            }`}
            loading="lazy"
            width="800"
            height="600"
          />
        ) : (
          <div className={`grid place-items-center bg-primary/10 font-title text-4xl text-primary ${featured ? "h-full min-h-80" : "h-60"}`} aria-label="Imagem ainda não cadastrada">
            LACE
          </div>
        )}
      </div>
      <div className={`flex flex-1 flex-col space-y-4 ${featured ? "justify-center p-8 lg:p-14" : "p-6"}`}>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{year}</p>
        <h3 className={`font-title ${featured ? "text-4xl lg:text-5xl" : "text-3xl"}`}>{title}</h3>
        {description && <p className={`leading-7 text-muted ${featured ? "" : "flex-1"}`}>{description}</p>}
        <div className="pt-4">
          <span className="inline-flex rounded-xl border border-primary px-6 py-3 font-semibold text-primary transition group-hover:bg-primary-fill group-hover:text-on-primary">
            {actionLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
