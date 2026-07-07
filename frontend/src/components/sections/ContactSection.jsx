import { Mail, Send } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import Button from "../ui/Button";

const fieldClass = "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function ContactSection() {
  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const email = data.get("email");
    const message = data.get("message");
    const subject = encodeURIComponent(`Contato pelo portal LACE — ${name}`);
    const body = encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`);

    window.location.href = `mailto:lab.lace.uff@gmail.com?subject=${subject}&body=${body}`;
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

            <a
              href="mailto:lab.lace.uff@gmail.com"
              className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-card p-5 text-text transition hover:border-primary hover:text-primary"
            >
              <Mail className="shrink-0 text-primary" aria-hidden="true" />
              <span>
                <span className="block text-sm text-muted">E-mail</span>
                <span className="font-semibold">lab.lace.uff@gmail.com</span>
              </span>
            </a>

            <h3 className="mt-10 font-title text-3xl">Redes sociais</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <a
                href="https://x.com/LaceUff"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition hover:border-primary hover:text-primary"
              >
                <FaXTwitter aria-hidden="true" /> <span>X / Twitter</span>
              </a>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 text-muted" title="Link em breve">
                <FaInstagram aria-hidden="true" /> <span>Instagram</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 text-muted" title="Link em breve">
                <FaFacebookF aria-hidden="true" /> <span>Facebook</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted">Os links do Instagram e do Facebook serão adicionados em breve.</p>
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
            <Button type="submit" variant="outline" className="mt-7 inline-flex items-center gap-2">
              <Send size={18} aria-hidden="true" /> Enviar mensagem
            </Button>
            <p className="mt-4 text-sm leading-6 text-muted">Ao enviar, seu aplicativo de e-mail será aberto com a mensagem preenchida.</p>
          </form>
        </div>
      </Container>
    </section>
  );
}
