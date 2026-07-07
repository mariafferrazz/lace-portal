import { useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BookOpen, ChevronDown } from "lucide-react";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const introduction = "O Laboratório de Agenciamentos Cotidianos e Experiências (LACE) reúne dois Grupos de Pesquisa certificados no CNPq: “Subjetividade, Memória e Violência do Estado” (UFF), liderado pela Prof.ª Dr.ª Joana D’Arc Fernandes Ferraz, e “Experiências de Trabalhadoras e Trabalhadores no Estado do Rio de Janeiro” (UFRRJ), liderado pelo Prof. Dr. Rafael Maul.";

const institutionalText = [
  "Esses pesquisadores, bem como todos os integrantes do LACE, concentram neste espaço virtual pesquisas relacionadas, na perspectiva histórica e da teoria da memória, à defesa dos direitos humanos, da justiça e da cidadania, principalmente no que se refere às manifestações sociais na cidade e no campo. Entre elas estão os movimentos de resistência indígenas, quilombolas, operários, camponeses, ribeirinhos, LGBTQIA+, de mulheres, de defesa da educação e do meio ambiente, além dos movimentos organizados de denúncia à violência do Estado e da memória registrada nos arquivos do Grupo Tortura Nunca Mais-RJ (GTNM/RJ).",
  "O registro dessas atividades ocorre por meio de narrativas orais, podcasts, entrevistas e storytelling. Outro formato é a produção audiovisual, com a edição de pequenos vídeos para o YouTube, que pode se desdobrar na produção de artigos científicos e resenhas. O material produzido tem como meta criar recursos didáticos e desenvolver metodologias de ensino para a Educação Básica, especialmente a pública, em modalidades diversas, como ensino regular, EJA, Educação do Campo, quilombola, indígena e EBTT.",
  "O desenvolvimento do LACE em formato digital apresenta-se como uma possibilidade rica de convergências críticas entre a produção do conhecimento na Universidade — reunindo pesquisadoras, pesquisadores e grupos com trajetórias e aportes diversos — e os agenciamentos e experiências de movimentos e comunidades. Procura-se, dessa forma, garantir o caráter público da Universidade não apenas formalmente, mas compreendendo-a como espaço convergente da produção de conhecimento.",
  "É urgente criar espaços de fala e visibilidade para esses grupos e para suas formas criativas e inovadoras de produzir novos saberes, a fim de construir outros paradigmas políticos e arranjos societários.",
  "Considerando o direito à memória, à verdade e à justiça, nosso país é um dos mais atrasados do continente no que se refere à reparação e ao esclarecimento dos crimes perpetrados durante a ditadura. É urgente esclarecer como, quando, por que e por quem foram praticados os crimes de lesa-humanidade, como assassinatos e desaparecimentos de pessoas que lutaram contra a ditadura empresarial-militar brasileira, bem como a participação das empresas na construção do golpe e de todo o terror imposto à sociedade entre as décadas de 1960 e 1980, com efeitos que se estendem aos dias atuais. Para isso, contamos com a parceria do GTNM/RJ, que possui um dos maiores arquivos sobre esse período. Sabemos também da dificuldade do país em construir mecanismos de justiça social, defesa dos direitos humanos e memória para outros períodos — questão urgente em um país marcado por séculos de escravidão e pelo descaso com sua memória.",
  "Temos assistido a ataques sistemáticos aos movimentos de resistência e ao desmonte de conquistas sociais e políticas. Sofrem ataques severos os direitos de proteção aos povos tradicionais e quilombolas, assim como as condições necessárias ao acesso à água potável, à internet, a itens de limpeza e higiene, a cestas básicas e a programas de auxílio ao emprego e à renda.",
  "Consideramos que a luta indígena tem papel de extrema importância em nossos trabalhos, não apenas no âmbito do direito à terra e à demarcação, mas também em suas elaborações sobre memória e ancestralidade, desenhando a resistência do que o autor Ailton Krenak chama de sujeito coletivo. O exercício de imaginar outro mundo, em tempos de emergência financeira e climática, interessa-nos para pensar as redes de relações contemporâneas.",
  "Os retrocessos também são evidentes em relação aos direitos das mulheres e da população LGBTQIA+, a começar pelos discursos conservadores e moralistas, refratários à defesa das diferenças culturais e religiosas. Declarações claramente homofóbicas e misóginas surgem no cenário público na contramão dos muitos movimentos que lutam contra a exploração sexual, em especial a infantil.",
  "O cenário para trabalhadoras e trabalhadores também é marcado pela precarização e pela retirada de direitos. Mudanças na legislação trabalhista e previdenciária fragilizam as condições de trabalho e atingem de maneira ainda mais intensa os grupos historicamente vulnerabilizados.",
  "É fundamental a existência de lugares que afirmem, também no interior da Universidade, o conhecimento produzido fora de seus muros. Nesse sentido, o LACE fortalece a indissociabilidade entre o ensino na Graduação e na Pós-Graduação, a pesquisa e a extensão.",
];

export default function AboutSection({ isOpen, onToggle }) {
  const contentId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <section id="sobre" className="scroll-mt-24 bg-surface py-24 lg:py-32">
      <Container>
        <SectionTitle subtitle="Conheça" title="O Laboratório" />

        <article id="apresentacao-lace" className="scroll-mt-24 overflow-hidden rounded-3xl border border-primary/30 bg-card">
          <div className="p-8 lg:p-12">
            <div className="flex items-center gap-3 text-primary">
              <BookOpen aria-hidden="true" />
              <p className="text-sm font-semibold uppercase tracking-[0.25em]">Apresentação institucional</p>
            </div>
            <p className="mt-6 max-w-5xl font-title text-2xl leading-relaxed text-text md:text-3xl">{introduction}</p>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={onToggle}
              className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary px-5 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {isOpen ? "Recolher apresentação" : "Ler apresentação completa"}
              <ChevronDown aria-hidden="true" size={18} className={`transition ${isOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                id={contentId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
                className="overflow-hidden"
              >
                <div className="border-t border-border px-8 py-10 lg:px-12">
                  <div className="max-w-4xl space-y-6 text-base leading-8 text-muted md:text-lg">
                    {institutionalText.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </article>

      </Container>
    </section>
  );
}
