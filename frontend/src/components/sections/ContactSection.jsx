import { useState } from "react";
import { Copy, ExternalLink, Mail, Send } from "lucide-react";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import Button from "../ui/Button";

const fieldClass = "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";
const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT;
const contactEmail = "lab.lace.uff@gmail.com";

export default function ContactSection() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailCopyStatus, setEmailCopyStatus] = useState("");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setEmailCopyStatus("E-mail copiado.");
    } catch {
      setEmailCopyStatus("Selecione o endereço e copie manualmente.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    if (!contactEndpoint) {
      setLoading(false);
      setStatus({ ok: false, message: "Envio de mensagens ainda não configurado." });
      return;
    }

    try {
      await fetch(contactEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          source: "lablace.com.br",
        }),
      });

      form.reset();
      setStatus({ ok: true, message: "Mensagem enviada. Obrigado pelo contato." });
    } catch {
      setStatus({ ok: false, message: "Não foi possível enviar agora. Tente novamente em instantes." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contato" className="scroll-mt-24 bg-surface py-24 lg:py-32">
      <Container>
        <SectionTitle subtitle="Contato" title="Contate-nos" />
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="max-w-xl text-lg leading-8 text-muted">
              Entre em contato com o LACE para saber mais sobre pesquisas, eventos, produções e possibilidades de colaboração.
            </p>

            <div className="mt-8 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
              <Mail className="shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <span className="block text-sm text-muted">E-mail</span>
                <input
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 font-semibold text-text outline-none selection:bg-primary selection:text-on-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                  type="email"
                  value={contactEmail}
                  readOnly
                  aria-label="E-mail do LACE"
                  onFocus={(event) => event.currentTarget.select()}
                />
              </div>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={copyEmail}
                aria-label="Copiar e-mail do LACE"
              >
                <Copy size={17} aria-hidden="true" /> <span className="hidden sm:inline">Copiar</span>
              </button>
              </div>
              {emailCopyStatus && <p className="mt-3 text-sm font-semibold text-muted" role="status">{emailCopyStatus}</p>}
            </div>

            <h3 className="mt-10 font-title text-3xl">Redes sociais</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <a
                href="https://x.com/LaceUff"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition hover:border-primary hover:text-primary"
              >
                <ExternalLink size={18} aria-hidden="true" /> <span>X / Twitter</span>
              </a>
              <a
                href="https://www.instagram.com/laceuff/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition hover:border-primary hover:text-primary"
              >
                <ExternalLink size={18} aria-hidden="true" /> <span>Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/Lace.uff"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition hover:border-primary hover:text-primary"
              >
                <ExternalLink size={18} aria-hidden="true" /> <span>Facebook</span>
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-7 md:p-10">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="font-semibold">
                Nome
                <input className={fieldClass} type="text" name="name" autoComplete="name" placeholder="Seu nome" required />
              </label>
              <label className="font-semibold">
                E-mail
                <input className={fieldClass} type="email" name="email" autoComplete="email" placeholder="seu@email.com" required />
              </label>
            </div>
            <label className="mt-6 block font-semibold">
              Mensagem
              <textarea className={`${fieldClass} min-h-40 resize-y`} name="message" placeholder="Como podemos ajudar?" required />
            </label>
            <Button type="submit" variant="outline" className="mt-7 inline-flex items-center gap-2 disabled:cursor-wait disabled:opacity-60" disabled={loading}>
              <Send size={18} aria-hidden="true" /> {loading ? "Enviando..." : "Enviar mensagem"}
            </Button>
            {status && (
              <p className={status.ok ? "mt-4 text-sm font-semibold text-green-700 dark:text-green-300" : "mt-4 text-sm font-semibold text-red-700 dark:text-red-300"} role="status">
                {status.message}
              </p>
            )}
            <p className="mt-4 text-sm leading-6 text-muted">A mensagem será enviada para a caixa de entrada do LACE.</p>
          </form>
        </div>
      </Container>
    </section>
  );
}
