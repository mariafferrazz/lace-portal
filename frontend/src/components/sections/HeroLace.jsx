import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";

export default function HeroLace({ onOpenAbout }) {
  return (
    <section className="relative overflow-hidden bg-background py-16 lg:py-24">
      <div
        className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[180px]"
        aria-hidden="true"
      />

      <Container>
        <div className="relative flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="group relative w-full max-w-5xl transition-transform duration-500 hover:scale-[1.02]"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-primary/30 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.55)] transition duration-500 group-hover:border-primary group-hover:shadow-[0_28px_90px_rgba(212,175,55,0.18)]">
              <img
                src="https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000101-1bbcb1bbcf/LACEE-6.webp?ph=3554c7d1fd"
                alt="Integrantes do Laboratório LACE"
                width="800"
                height="600"
                className="h-auto w-full object-contain"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-14 max-w-4xl text-center"
          >
            <h1 className="font-title text-5xl leading-tight sm:text-6xl lg:text-7xl">
              Laboratório de Agenciamentos Cotidianos e Experiências
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-muted">
              O LACE conecta universidade, memória e movimentos sociais por meio da pesquisa, da produção audiovisual e da defesa dos direitos humanos.
            </p>
            <div className="mt-14 flex flex-wrap justify-center gap-4">
              <Button type="button" variant="outline" onClick={onOpenAbout}>Conheça o laboratório</Button>
              <Button as={Link} to="/producao-academica/pesquisas" variant="outline">Pesquisas</Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
