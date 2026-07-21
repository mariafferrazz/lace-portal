import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ExternalLink, FileText, X } from "lucide-react";
import Container from "../../components/ui/Container";
import SocialShare from "../../components/ui/SocialShare";
import api from "../../services/api";
import { contentFileUrls, contentImage } from "../../utils/contentMetadata";

const aracruzResearchers = [
  {
    name: "Ana Cláudia Bessa",
    description: "Graduada em Sociologia/UFF, mestranda em Sociologia Antropologia PPGSA/UFRJ.",
    lattes: "http://lattes.cnpq.br/5372448446799604",
  },
  {
    name: "Barbara Goulart",
    description: "Pesquisadora de pós-doutorado no IESP/UERJ. Doutora e mestre em Sociologia pelo PPGSA/UFRJ.",
    lattes: "http://lattes.cnpq.br/0162457625950095",
  },
  {
    name: "Caio Mattos Santos",
    description: "Graduado em Antropologia (UFF); mestrando no Programa de Pós-Graduação em Antropologia Social (PPGAS/UFRJ).",
    lattes: "http://lattes.cnpq.br/3596827374316338",
  },
  {
    name: "Flávia Mendes Ferreira",
    description: "Doutora em Ciência Política/UFF. Professora da Rede Estadual do Rio de Janeiro.",
    lattes: "http://lattes.cnpq.br/5931971441443946",
  },
  {
    name: "Geraldiny Malaguti",
    description: "Doutoranda do PPGS/UFF. Mestre em Planejamento Urbano e Regional. Professora da Rede Municipal de Armação de Búzios.",
    lattes: "http://lattes.cnpq.br/1401983451198989",
  },
  {
    name: "João Pedro Cavalcanti de Carvalho",
    description: "Graduado em Sociologia (UFF).",
    lattes: "http://lattes.cnpq.br/0115053069778572",
  },
  {
    name: "Livia dos Santos Chagas",
    description: "Graduada em História (UFF) e Direito (UFRJ), mestre em Memória Social (UNIRIO).",
    lattes: "http://lattes.cnpq.br/1896839543516251",
  },
  {
    name: "Maíne Santos Souza da Silva",
    description: "Mestre e licenciada em Ciências Sociais (UFBA).",
    lattes: "http://lattes.cnpq.br/7302099867351183",
  },
  {
    name: "Maynõ Guarani Cunha da Silva",
    description: "Graduando em Licenciatura Intercultural Indígena (PROLIND - UFES).",
    lattes: "http://lattes.cnpq.br/0194073152863531",
  },
  {
    name: "Rosane Arena Muniz",
    description: "Graduada em Direito (UCAM). Pós-graduação em Teoria e Dogmática Constitucional. Advogada do Quilombo Linharinho.",
    lattes: "http://lattes.cnpq.br/9376585503193624",
  },
];

const researches = [
  {
    title: "Complexo Aracruz Celulose S/A - Hoje Grupo Suzano S/A",
    shortTitle: "Aracruz Celulose S/A",
    slug: "aracruz-celulose",
    url: "https://lab-lace.webnode.page/aracruz-celulose-s-a/",
    image:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000151-cbc8ccbc8e/unnamed.webp?ph=3554c7d1fd",
    summary: [
      "Esta pesquisa vincula-se ao Edital de seleção de pesquisas relacionadas ao Projeto \"A responsabilidade de empresas por violações de direitos durante a Ditadura\", proposto pelo Centro de Antropologia Forense da Universidade Federal de São Paulo (CAAF/UNIFESP), financiada pelo MPF com recursos provenientes do Termo de Ajuste de Conduta (TAC) da Volkswagen do Brasil.",
      "Foram selecionados dez grupos de pesquisa que investigaram a colaboração de dez empresas com indícios de violações de direitos praticados durante a ditadura empresarial-militar brasileira. As pesquisas selecionadas foram: Aracruz, Cobrasma, Cia Docas de Santos, Companhia Siderúrgica Nacional, Fiat, Folha de S. Paulo, Itaipu, Josapar, Paranapanema e Petrobras. Em 2023, por meio de outro TAC do MPF, outras três empresas passaram a ser investigadas: Belgo Mineira, Embraer e Mannesmann.",
      "A pesquisa sobre a existência de violações de direitos, operadas pelo Grupo Aracruz Celulose S/A, durante o período da ditadura empresarial-militar brasileira (1964-1985) e pós-ditadura, foi coordenada pela Profª Drª Joana D'Arc Fernandes Ferraz, professora da Universidade Federal Fluminense (UFF), docente do Departamento de Sociologia e Metodologia das Ciências Sociais (GSO) e do Programa de Pós-Graduação em Sociologia (PPGS), no âmbito do Instituto de Ciências Humanas e Filosofia (ICHF).",
      "A pesquisa sobre as violações de direitos do Grupo Aracruz Celulose S/A identificou a existência de três grupos atingidos: indígenas Tupinikim e Guarani, residentes nos municípios de Aracruz/ES; quilombolas do Sapê do Norte, residentes nos municípios de São Mateus e Conceição da Barra/ES; além dos trabalhadores da empresa, em sua maioria residentes no bairro-empresa Coqueiral de Aracruz. Também foram vistos relatos de outros grupos atingidos, dentre eles camponeses, pescadores e ribeirinhos.",
      "O relatório final foi entregue ao CAAF em 15 de agosto de 2023.",
    ],
    researchers: aracruzResearchers,
    commission:
      "No CAAF, foi constituída uma comissão científica para acompanhamento do projeto, composta por sua coordenação, integrada por Edson Teles (coordenador), Carla Osmo e Marília Calazans (vice-coordenadoras), e por pessoas com trajetória de trabalho no campo da justiça de transição e preocupação específica com a colaboração de empresas na prática de violações de direitos humanos: Adriana Santos (UFRR), Aparecido de Faria (sociedade civil), Bruno Comparato (Unifesp), Elson Mattos (Unifesp), Flavia Rios (UFF), Javier Amadeo (Unifesp), Laura Bernal (Pontificia Universidad Javeriana, Colômbia), Leigh Payne (University of Oxford, Inglaterra), Rosa Cardoso (sociedade civil) e Victoria Basualdo (Conicet/Flacso, Argentina).",
    publicReportUrl: "https://www.unifesp.br/reitoria/caaf/images/CAAF/Empresas_e_Ditadura/InformePublico.pdf",
  },
  {
    title: "Ditadura na UFF",
    shortTitle: "Ditadura na UFF",
    slug: "ditadura-na-uff",
    url: "https://lab-lace.webnode.page/ditadura-na-uff/",
    summary: [
      "A presente pesquisa \"Mecanismos de repressão e vigilância da ditadura empresarial-militar no âmbito da Universidade Federal Fluminense (UFF) e o perfil dos atingidos\" pretende ampliar a lista divulgada pelo relatório \"Ditadura e Resistências: a Rebeldia dos Professores da UFF\", organizado há quase uma década pelo Grupo de Trabalho de História do Movimento Docente, que apontou para um quantitativo muito expressivo de professores ligados à referida universidade, perseguidos pelo autoritarismo brasileiro entre as décadas de 1960 e 1980. Além disso, nossa pesquisa também busca mapear o nome de estudantes e funcionários monitorados, nos anos 70, pela Assessoria Especial de Segurança e Informação (AESI) da UFF e pela Divisão de Segurança e Informação (DSI) do Ministério da Educação e Cultura (MEC).",
      "Como metodologia de trabalho, a pesquisa finca-se nos acervos custodiados no Arquivo Nacional, particularmente no Memórias Reveladas, na parte referente ao acervo do Serviço Nacional de Informações (SNI), onde podemos encontrar os arquivos, de forma on-line, tanto da DSI quanto da AESI-UFF, dentre outros. Outro espaço também presente em nosso campo de trabalho é o acervo da própria Universidade Federal Fluminense, localizado em Jurujuba (Niterói), que nos possibilita a realização de consultas aos arquivos da instituição de forma presencial.",
      "O conteúdo produzido por esta pesquisa pretende servir de base para uma possível e necessária Comissão da Verdade da UFF, mecanismo ainda muito pouco debatido e pensado no interior da universidade em questão. Para além do sentido mais amplo deste trabalho, que é organizar os diferentes perfis dos atingidos pelo regime empresarial-militar brasileiro, buscaremos ultrapassar a lógica, por vezes simplificadora e muito comum em pesquisas fundamentadas por uma base teórica mais tradicional, que coloca os atingidos pelo autoritarismo estruturado entre 1964 e 1988, no Brasil, como um grupo coeso oposicionista, sem explicitar uma reflexão acerca das singularidades e especificidades, tão presentes quando pensamos em recortes de gênero, raça, classe e sexualidade, no interior deste próprio coletivo. Com isso, mapearemos importantes pontos de contatos e distanciamentos entre os estudantes, professores e funcionários da instituição.",
      "Ademais, queremos também identificar determinados espaços marcados pela presença de reuniões, grupos de estudos, práticas de afeto e sociabilidade, resistências, produções de materiais de cunho oposicionista, de prisões e perseguições, com o objetivo de pensar acerca da recuperação destes locais enquanto lugares de memória e de uma possível transformação dos mesmos em lugares de consciência, convocando assim não somente o público da Universidade Federal Fluminense, mas a sociedade de Niterói como um todo e os cidadãos dos demais municípios que também possuem suas histórias entrelaçadas com a presença da instituição, a refletirem sobre um dos temas sensíveis centrais na história do nosso país.",
      "A pesquisa faz parte de um projeto de Iniciação Científica e é coordenada pela professora Joana D'Arc Fernandes Ferraz, docente da Universidade Federal Fluminense, ligada ao Departamento de Sociologia e Metodologia das Ciências Sociais (GSO) e ao Programa de Pós-Graduação em Sociologia (PPGS), no âmbito do Instituto de Ciências Humanas e Filosofia (ICHF). Os trabalhos de pesquisa são conduzidos pelo estudante Gabriel Rivas, membro do LACE, graduando em Ciências Sociais pela UFF e licenciado em História pela mesma instituição.",
    ],
  },
];

function researchSlug(title) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function researchFromContent(content) {
  return {
    title: content.title,
    shortTitle: content.metadata?.shortTitle || content.title,
    slug: researchSlug(content.title),
    image: contentImage(content),
    summary: content.description ? content.description.split(/\n{2,}/).filter(Boolean) : ["Pesquisa em organizacao."],
    publicReportUrl: contentFileUrls(content)[0],
  };
}

function mergeDynamicResearches(dynamicContents) {
  const grouped = new Map(researches.map((research) => [research.slug, research]));

  dynamicContents.forEach((content) => {
    const research = researchFromContent(content);
    if (!grouped.has(research.slug)) grouped.set(research.slug, research);
  });

  return [...grouped.values()];
}

export default function Pesquisas() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dynamicContents, setDynamicContents] = useState([]);
  const allResearches = useMemo(() => mergeDynamicResearches(dynamicContents), [dynamicContents]);
  const activeResearch = useMemo(() => {
    const hash = location.hash.replace("#", "");
    return hash ? allResearches.find((item) => item.slug === hash) || null : null;
  }, [allResearches, location.hash]);

  useEffect(() => {
    let active = true;
    api
      .get("/contents", { params: { type: "RESEARCH" } })
      .then(({ data }) => {
        if (active) setDynamicContents(data.contents || []);
      })
      .catch(() => {
        if (active) setDynamicContents([]);
      });
    return () => {
      active = false;
    };
  }, []);

  function setResearchAndHash(research) {
    navigate(`${location.pathname}${location.search}#${research.slug}`, { replace: true });
  }

  function closeResearch() {
    navigate(`${location.pathname}${location.search}`, { replace: true });
  }

  function navigateResearch(direction) {
    if (!activeResearch) return;

    const currentIndex = allResearches.findIndex((research) => research.title === activeResearch.title);
    const nextIndex =
      direction === "previous"
        ? (currentIndex - 1 + allResearches.length) % allResearches.length
        : (currentIndex + 1) % allResearches.length;

    setResearchAndHash(allResearches[nextIndex]);
  }

  useEffect(() => {
    if (!activeResearch) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        navigate(`${location.pathname}${location.search}`, { replace: true });
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeResearch, location.pathname, location.search, navigate]);

  return (
    <main className="bg-background py-20 lg:py-28">
      <Container>
        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Produção acadêmica</p>
          <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">Pesquisas</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Nessa aba você pode conferir as pesquisas desenvolvidas pelo nosso núcleo de pesquisa:
          </p>
        </header>

        <section className="mt-12 grid gap-4 sm:grid-cols-2" aria-label="Pesquisas">
          {allResearches.map((research) => (
            <button
              key={research.title}
              className="group inline-flex min-h-20 w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 text-left font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              type="button"
              onClick={() => setResearchAndHash(research)}
            >
              <span>{research.shortTitle}</span>
              <FileText size={20} className="shrink-0 text-primary transition group-hover:text-on-primary" aria-hidden="true" />
            </button>
          ))}
        </section>
      </Container>

      {activeResearch && (
        <ResearchModal
          research={activeResearch}
          researchPosition={allResearches.findIndex((item) => item.title === activeResearch.title) + 1}
          researchCount={allResearches.length}
          onClose={closeResearch}
          onNavigate={navigateResearch}
        />
      )}
    </main>
  );
}

function ResearchModal({ research, researchPosition, researchCount, onClose, onNavigate }) {
  useEffect(() => {
    const navigateByKeyboard = (event) => {
      const tagName = event.target?.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") return;

      if (event.key === "ArrowLeft") onNavigate("previous");
      if (event.key === "ArrowRight") onNavigate("next");
    };

    window.addEventListener("keydown", navigateByKeyboard);

    return () => window.removeEventListener("keydown", navigateByKeyboard);
  }, [onNavigate]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="research-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/20 bg-background p-6 shadow-2xl md:p-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-3 text-white transition hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          aria-label="Fechar pesquisa"
        >
          <X size={24} aria-hidden="true" />
        </button>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Pesquisa</p>
        <h2 id="research-title" className="mt-3 pr-12 font-title text-4xl md:text-5xl">
          {research.title}
        </h2>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigate("previous")}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Pesquisa anterior"
          >
            <ChevronLeft size={18} aria-hidden="true" />
            Anterior
          </button>
          <span className="text-sm font-semibold text-muted">
            {researchPosition} de {researchCount}
          </span>
          <button
            type="button"
            onClick={() => onNavigate("next")}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Próxima pesquisa"
          >
            Próxima
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>

        {research.image && (
          <img
            className="mt-8 max-h-[460px] w-full rounded-2xl border border-border object-cover"
            src={research.image}
            alt={research.title}
            loading="lazy"
          />
        )}

        <section className="mt-8 space-y-5 leading-8 text-muted">
          <h3 className="font-title text-3xl text-text">Resumo da pesquisa</h3>
          {research.summary.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        {research.researchers && (
          <section className="mt-10">
            <h3 className="font-title text-3xl text-text">Equipe de pesquisa</h3>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {research.researchers.map((researcher) => (
                <article key={researcher.name} className="rounded-2xl border border-border bg-card p-4">
                  <h4 className="font-semibold text-text">{researcher.name}</h4>
                  <p className="mt-2 text-sm leading-6 text-muted">{researcher.description}</p>
                  <a
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-text"
                    href={researcher.lattes}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Lattes <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">Dentre outros.</p>
          </section>
        )}

        {research.commission && (
          <section className="mt-10 rounded-2xl border border-border bg-card p-5">
            <h3 className="font-title text-3xl text-text">Comissão científica</h3>
            <p className="mt-4 leading-8 text-muted">{research.commission}</p>
          </section>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {research.publicReportUrl && (
            <a
              className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary"
              href={research.publicReportUrl}
              target="_blank"
              rel="noreferrer"
            >
              Informe Público <ExternalLink size={16} aria-hidden="true" />
            </a>
          )}
        </div>
        <SocialShare title={research.title} url={`/producao-academica/pesquisas#${research.slug}`} className="mt-8" />
      </div>
    </div>,
    document.body,
  );
}
