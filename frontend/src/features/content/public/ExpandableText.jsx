import { useState } from "react";

export default function ExpandableText({ children, collapsedClassName = "line-clamp-4", moreLabel = "Ver mais", lessLabel = "Ver menos" }) {
  const [expanded, setExpanded] = useState(false);
  if (!children) return null;
  return <div><div className={`whitespace-pre-line leading-7 text-muted ${expanded ? "" : collapsedClassName}`}>{children}</div><button className="mt-3 font-semibold text-primary" type="button" onClick={() => setExpanded((value) => !value)}>{expanded ? lessLabel : moreLabel}</button></div>;
}
