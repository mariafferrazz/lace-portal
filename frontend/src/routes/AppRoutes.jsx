import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const MainLayout = lazy(() => import("../layouts/MainLayout"));
const Home = lazy(() => import("../pages/Home/Home"));
const AccessPage = lazy(() => import("../pages/Access/AccessPage"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Filmes = lazy(() => import("../pages/CinemaDitadura/Filmes"));
const Verbetes = lazy(() => import("../pages/CinemaDitadura/Verbetes"));
const DynamicMostra = lazy(() => import("../pages/CinemaDitadura/DynamicMostra"));
const Entrevistas = lazy(() => import("../pages/ProducaoAudiovisual/Entrevistas"));
const Podcasts = lazy(() => import("../pages/ProducaoAudiovisual/Podcasts"));
const LinhasDeFugasVirais = lazy(() => import("../pages/ProducaoAcademica/LinhasDeFugasVirais"));
const Artigos = lazy(() => import("../pages/ProducaoAcademica/Artigos"));
const Pesquisas = lazy(() => import("../pages/ProducaoAcademica/Pesquisas"));
const DynamicPesquisa = lazy(() => import("../pages/ProducaoAcademica/DynamicPesquisa"));
const DynamicEventosYear = lazy(() => import("../pages/Eventos/DynamicEventosYear"));

const withSuspense = (element) => <Suspense fallback={null}>{element}</Suspense>;

export default function AppRoutes() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/admin" element={withSuspense(<AccessPage />)} />

        <Route element={withSuspense(<MainLayout />)}>
          {/* Home */}
          <Route path="/" element={withSuspense(<Home />)} />

          {/* Cinema e Ditadura */}
          <Route path="/cinema-e-ditadura/filmes" element={withSuspense(<Filmes />)} />
          <Route path="/cinema-e-ditadura/verbetes" element={withSuspense(<Verbetes />)} />
          <Route path="/cinema-e-ditadura/:showSlug" element={withSuspense(<DynamicMostra />)} />

          {/* Produção Audiovisual */}
          <Route
            path="/producao-audiovisual/entrevistas"
            element={withSuspense(<Entrevistas />)}
          />
          <Route
            path="/producao-audiovisual/podcasts"
            element={withSuspense(<Podcasts />)}
          />

          {/* Produção Acadêmica */}
          <Route
            path="/producao-academica/linhas-de-fugas-virais"
            element={withSuspense(<LinhasDeFugasVirais />)}
          />
          <Route
            path="/producao-academica/artigos"
            element={withSuspense(<Artigos />)}
          />
          <Route
            path="/producao-academica/pesquisas"
            element={withSuspense(<Pesquisas />)}
          />
          <Route
            path="/producao-academica/pesquisas/:researchSlug"
            element={withSuspense(<DynamicPesquisa />)}
          />

          {/* Eventos */}
          <Route path="/eventos/:year" element={withSuspense(<DynamicEventosYear />)} />

          {/* 404 */}
          <Route path="*" element={withSuspense(<NotFound />)} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
