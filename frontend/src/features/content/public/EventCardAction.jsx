import { eventInteraction } from "./contentPresentation";

export default function EventCardAction({ content, onOpenModal, className = "" }) {
  const interaction = eventInteraction(content);
  const styles = `inline-flex cursor-pointer items-center justify-center rounded-xl border border-primary/60 px-4 py-3 font-semibold text-primary transition hover:border-primary hover:bg-primary-fill hover:text-on-primary ${className}`;
  if (interaction.mode === "PAGE") return <a className={styles} href={interaction.path}>{interaction.label}</a>;
  return <button className={styles} type="button" onClick={() => onOpenModal(content)}>{interaction.label}</button>;
}
