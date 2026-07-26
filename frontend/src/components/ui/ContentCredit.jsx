export default function ContentCredit({
  content,
  name,
  profileUrl,
  submittedBy,
  label = "Pesquisador(a)",
  className = "",
  linkName = true,
}) {
  const metadataAuthors = Array.isArray(content?.metadata?.authors)
    ? content.metadata.authors.filter(Boolean).join(", ")
    : content?.metadata?.authors;
  const researcherName = (name || metadataAuthors || content?.researcherName || content?.meta || "").trim();
  if (!researcherName) return null;

  const researcherUrl =
    profileUrl ||
    content?.researcherUrl ||
    content?.metadata?.researcherUrl ||
    content?.metadata?.researcherProfileUrl ||
    content?.metadata?.lattesUrl ||
    content?.metadata?.curriculumUrl ||
    content?.metadata?.linkedinUrl;
  const submitterName = submittedBy || content?.createdBy?.name;
  const showSubmitter = submitterName && submitterName.trim() && submitterName.trim() !== researcherName;
  const nameNode = researcherUrl && linkName ? (
    <a
      className="font-semibold text-text underline decoration-primary/50 underline-offset-4 transition hover:text-primary"
      href={researcherUrl}
      target="_blank"
      rel="noreferrer"
    >
      {researcherName}
    </a>
  ) : (
    <strong className="text-text">{researcherName}</strong>
  );

  return (
    <p className={`text-sm leading-6 text-muted ${className}`}>
      {label}: {nameNode}
      {showSubmitter && <span className="block text-xs">Adicionado por {submitterName}</span>}
    </p>
  );
}
