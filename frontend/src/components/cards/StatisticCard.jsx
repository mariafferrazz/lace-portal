export default function StatisticCard({
  number,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center transition hover:-translate-y-1 hover:border-primary/60">
      <h2 className="text-5xl font-bold text-primary">
        {number}
      </h2>

      <h3 className="mt-4 text-xl font-semibold">
        {title}
      </h3>

      {description && (
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
